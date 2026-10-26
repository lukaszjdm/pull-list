#!/usr/bin/env python3
"""Daily public-inventory snapshot fetcher for LKQ Pick Your Part.
Captures only vehicles present in returned HTML. Never labels it complete unless verified.
Does not bypass access restrictions; requests only three public inventory pages.
"""
from __future__ import annotations
import datetime as dt, json, re, sys, pathlib
import requests
from bs4 import BeautifulSoup

ROOT=pathlib.Path(__file__).resolve().parent
PATH=ROOT/'yard-inventory.json'
JS_PATH=ROOT/'yard-inventory.js'
YARDS={'north':'https://www.pyp.com/inventory/chicago-north-1581/',
       'south':'https://www.pyp.com/inventory/chicago-south-1585/',
       'island':'https://www.pyp.com/inventory/blue-island-1582/'}
HEADERS={'User-Agent':'PullListInventory/1.0 (personal Illinois yard inventory reader; contact repository owner)'}
TITLE=re.compile(r'^(19\d{2}|20\d{2})\s+(.+?)\s{2,}(.+)$',re.I)
VIN=re.compile(r'\b(?:VIN\s*)?([A-HJ-NPR-Z0-9]{17})\b',re.I)
ROW=re.compile(r'\bRow\s+([A-Za-z0-9-]+)',re.I)
SPACE=re.compile(r'\bSpace\s+([A-Za-z0-9-]+)',re.I)
SECTION=re.compile(r'\bSection\s+(.+?)\s*\|?\s*Row\b',re.I)
STOCK=re.compile(r'\b(158[125]-\d{4,})\b')

def parse(html,yard):
    soup=BeautifulSoup(html,'html.parser'); vehicles=[];seen=set()
    # Public rendered cards use an H3 for each vehicle, with metadata before next H3.
    for h in soup.find_all('h3'):
        title=' '.join(h.stripped_strings)
        m=re.match(r'^(\d{4})\s+(.+)$',title)
        if not m:continue
        # Split by strong elements when possible, otherwise treat second token as make.
        words=m.group(2).split()
        if len(words)<2:continue
        special=['MERCEDES-BENZ','LAND ROVER','ALFA ROMEO','ASTON MARTIN']
        rem=' '.join(words)
        make=next((x.title() for x in special if rem.upper().startswith(x+' ')),None)
        if make:model=rem[len(make):].strip()
        else:make=words[0].title();model=' '.join(words[1:]).title()
        collected=[]
        for sibling in h.next_elements:
            if sibling is h:continue
            if getattr(sibling,'name',None)=='h3':break
            if getattr(sibling,'name',None) in ['script','style']:continue
            if isinstance(sibling,str):
                t=sibling.strip()
                if t:collected.append(t)
            if len(collected)>100:break
        block=' '.join(collected)
        vin=(VIN.search(block).group(1) if VIN.search(block) else '')
        stock=(STOCK.search(block).group(1) if STOCK.search(block) else '')
        if not vin and not stock: continue # guard against unrelated cards
        row=(ROW.search(block).group(1) if ROW.search(block) else '')
        space=(SPACE.search(block).group(1) if SPACE.search(block) else '')
        section=(SECTION.search(block).group(1).strip(' |') if SECTION.search(block) else '')
        ident=stock or vin
        if ident in seen:continue
        seen.add(ident)
        vehicles.append(dict(id=f'{yard}-{ident}',yard=yard,year=int(m.group(1)),make=make,model=model,row=row,space=space,section=section,stock=stock,vin=vin,source='Official LKQ public inventory page',sourceUrl=YARDS[yard]))
    return vehicles

def main():
    feed=json.loads(PATH.read_text()) if PATH.exists() else {'format':'pull-list-yard-feed-v1','yards':{}}
    feed['format']='pull-list-yard-feed-v1'
    now=dt.datetime.now(dt.timezone.utc).isoformat().replace('+00:00','Z')
    for yard,url in YARDS.items():
        old=feed['yards'].get(yard,{})
        try:
            response=requests.get(url,headers=HEADERS,timeout=35)
            response.raise_for_status()
            vehicles=parse(response.text,yard)
            if not vehicles:raise RuntimeError('No verifiable vehicle cards in fetched HTML; likely dynamic inventory or blocked access')
            # Public page may only show last-chance or one segment; never claim complete.
            feed['yards'][yard]={ 'status':'partial','checkedAt':now,'sourceUrl':url,
               'message':'Partial public-page results only; full yard inventory not verified. Confirm cars with the yard.',
               'vehicles':vehicles}
            print(yard,len(vehicles),'public vehicle cards')
        except Exception as exc:
            # Keep old snapshot but mark as stale; NEVER mislabel it live.
            feed['yards'][yard]={**old,'status':'stale','message':'Refresh failed: '+str(exc)[:180]+'. Showing previously observed vehicles; check the official yard.'}
            print(yard,'ERROR',exc,file=sys.stderr)
    feed['yards'].setdefault('summit',{'status':'unavailable','checkedAt':None,'sourceUrl':None,'message':'Official Summit feed has not been integrated.','vehicles':[]})
    feed['generatedAt']=now
    # Keep the offline JavaScript fallback in sync with the exact same snapshot.
    data=json.dumps(feed,indent=2,ensure_ascii=False)+'\n'
    PATH.write_text(data)
    JS_PATH.write_text('window.PULL_LIST_BUNDLED_YARDS = '+json.dumps(feed,ensure_ascii=False,separators=(',',':'))+';\n')
    # Not complete until confirmed by a separate authoritative full-coverage source.
    if not any(feed['yards'][k].get('status')=='partial' for k in YARDS):
        raise SystemExit('All LKQ fetches failed; stale snapshot retained. Inspect logs.')

if __name__=='__main__':main()
