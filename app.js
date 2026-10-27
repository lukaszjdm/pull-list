'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const YARDS={north:{name:'LKQ Chicago North',url:'https://www.pyp.com/inventory/chicago-north-1581/'},south:{name:'LKQ Chicago South',url:'https://www.pyp.com/inventory/chicago-south-1585/'},island:{name:'LKQ Blue Island',url:'https://www.pyp.com/inventory/blue-island-1582/'},summit:{name:'Pick-n-Pull Summit',url:'https://www.picknpull.com/check-inventory/vehicle-search'},demo:{name:'Demo · Sample data',url:''}};
const DEMO={id:'demo-mazda6',yard:'demo',year:2016,make:'Mazda',model:'Mazda6',trim:'Sport/GX',row:'—',vin:'JM1GJ1U51G1409961',engine:'2.5L 4-cylinder',body:'Sedan',demo:true};
const AUDI_DEMO={id:'demo-audi-a6',yard:'demo',year:2012,make:'Audi',model:'A6',trim:'Not confirmed',row:'—',vin:'WAUDFAFC5CN134675',engine:'2.0L 4-cylinder',body:'Sedan',demo:true};
const FORD_DEMO={id:'demo-ford-f250',yard:'demo',year:2011,make:'Ford',model:'F-250 SD',trim:'Not confirmed',row:'—',vin:'1FT7X2B61BEC79617',engine:'6.2L V8 gasoline',body:'Pickup',demo:true};
const MORE_DEMOS = [{"id": "research-1ft7x2b61bec79617", "yard": "demo", "year": 2011, "make": "Ford", "model": "F-250 SD", "trim": "", "row": "—", "vin": "1FT7X2B61BEC79617", "engine": "8 Cyl, 6.2L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / P473 (2011–2016)", "demo": true}, {"id": "research-1d7rb1ct5as126850", "yard": "demo", "year": 2010, "make": "Ram", "model": "1500", "trim": "", "row": "—", "vin": "1D7RB1CT5AS126850", "engine": "8 Cyl, 5.7L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth-generation Dodge-badged phase / DS/DJ (2009–2010)", "demo": true}, {"id": "research-jhmbb1173pc001901", "yard": "demo", "year": 1993, "make": "Honda", "model": "Prelude", "trim": "", "row": "—", "vin": "JHMBB1173PC001901", "engine": "4 Cyl, 2.2L, H22A1", "body": "Coupe", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / BA8/BA9/BB1-BB4 (1992–1996)", "demo": true}, {"id": "research-wauafafl9en039199", "yard": "demo", "year": 2014, "make": "Audi", "model": "A4", "trim": "", "row": "—", "vin": "WAUAFAFL9EN039199", "engine": "4 Cyl, 1.984000L, Flex Fuel Engine", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "B8 (2009–2016)", "demo": true}, {"id": "research-1g6ab5sa6d0125854", "yard": "demo", "year": 2013, "make": "Cadillac", "model": "ATS", "trim": "", "row": "—", "vin": "1G6AB5SA6D0125854", "engine": "4 Cyl, 2.5L, LCV", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first and only generation / Alpha (2013–2019)", "demo": true}, {"id": "research-1b7hc16x11s749710", "yard": "demo", "year": 2001, "make": "Dodge", "model": "Ram 1500", "trim": "", "row": "—", "vin": "1B7HC16X11S749710", "engine": "6 Cyl, 3.9L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / BR/BE (1994–2001)", "demo": true}, {"id": "research-wddhf9ab1aa195372", "yard": "demo", "year": 2010, "make": "Mercedes-Benz", "model": "E-Class", "trim": "", "row": "—", "vin": "WDDHF9AB1AA195372", "engine": "8 Cyl, 5.5L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "W212 (2010–2016)", "demo": true}, {"id": "research-yv1js8808p0124913", "yard": "demo", "year": 1993, "make": "Volvo", "model": "940", "trim": "", "row": "—", "vin": "YV1JS8808P0124913", "engine": "4 Cyl, 2.316000L, B230F", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "900 Series (1991–1995)", "demo": true}, {"id": "research-1g1ze5st1gf253664", "yard": "demo", "year": 2016, "make": "Chevrolet", "model": "Malibu", "trim": "", "row": "—", "vin": "1G1ZE5ST1GF253664", "engine": "4 Cyl, 1.5L, LFV - DI: Direct Injection, VVT, GEN1 GMNA", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "ninth generation / E2XX (2016–2025)", "demo": true}, {"id": "research-wa1lfafp2ea010112", "yard": "demo", "year": 2014, "make": "Audi", "model": "Q5", "trim": "", "row": "—", "vin": "WA1LFAFP2EA010112", "engine": "4 Cyl, 1.984000L, 2.0T", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "1st generation (2009–2017)", "demo": true}, {"id": "research-1ftrx08lxwkb01237", "yard": "demo", "year": 1998, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTRX08LXWKB01237", "engine": "8 Cyl, 5.4L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "tenth generation / PN96 (1997–2003)", "demo": true}, {"id": "research-1ftzf1721wkb04691", "yard": "demo", "year": 1998, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTZF1721WKB04691", "engine": "6 Cyl, 4.2L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "tenth generation / PN96 (1997–2003)", "demo": true}, {"id": "research-1c4rjfct3cc184642", "yard": "demo", "year": 2012, "make": "Jeep", "model": "Grand Cherokee", "trim": "", "row": "—", "vin": "1C4RJFCT3CC184642", "engine": "8 Cyl, 5.7L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / WK2 (2011–2021)", "demo": true}, {"id": "research-5j8yd4h53jl023451", "yard": "demo", "year": 2018, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "5J8YD4H53JL023451", "engine": "6 Cyl, 3.5L, J35Y5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / YD3 (2014–2020)", "demo": true}, {"id": "research-wba3a5c52ef453519", "yard": "demo", "year": 2014, "make": "BMW", "model": "3-Series", "trim": "", "row": "—", "vin": "WBA3A5C52EF453519", "engine": "4 Cyl, 2.00L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "F3x (2012–2019)", "demo": true}, {"id": "research-1d7hu18n18s595220", "yard": "demo", "year": 2008, "make": "Dodge", "model": "Ram 1500", "trim": "", "row": "—", "vin": "1D7HU18N18S595220", "engine": "8 Cyl, 4.7L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / DR/DH/D1/DC (2002–2008)", "demo": true}, {"id": "research-1d7hu18268s636365", "yard": "demo", "year": 2008, "make": "Dodge", "model": "Ram 1500", "trim": "", "row": "—", "vin": "1D7HU18268S636365", "engine": "8 Cyl, 5.7L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / DR/DH/D1/DC (2002–2008)", "demo": true}, {"id": "research-1gnfk13018j182584", "yard": "demo", "year": 2008, "make": "Chevrolet", "model": "Tahoe", "trim": "", "row": "—", "vin": "1GNFK13018J182584", "engine": "8 Cyl, 5.3L, LMG", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Flexible Fuel Vehicle (FFV)", "generation": "third generation / GMT900 (2007–2014)", "demo": true}, {"id": "research-1gnukbe05ar100776", "yard": "demo", "year": 2010, "make": "Chevrolet", "model": "Tahoe", "trim": "", "row": "—", "vin": "1GNUKBE05AR100776", "engine": "8 Cyl, 5.3L, LMG", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Flexible Fuel Vehicle (FFV)", "generation": "third generation / GMT900 (2007–2014)", "demo": true}, {"id": "research-19uub2f58fa008085", "yard": "demo", "year": 2015, "make": "Acura", "model": "TLX", "trim": "", "row": "—", "vin": "19UUB2F58FA008085", "engine": "6 Cyl, 3.474057568L, J35Y6", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / UB1-UB4 (2015–2020)", "demo": true}, {"id": "research-jm1nc26f280144309", "yard": "demo", "year": 2008, "make": "Mazda", "model": "MX-5 Miata", "trim": "", "row": "—", "vin": "JM1NC26F280144309", "engine": "2L, LFN (2.0L)", "body": "Convertible/Cabriolet", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / NC (2006–2015)", "demo": true}, {"id": "research-jteew21a460023115", "yard": "demo", "year": 2006, "make": "Toyota", "model": "Highlander Hybrid", "trim": "", "row": "—", "vin": "JTEEW21A460023115", "engine": "6 Cyl, 3.3L, 3MZ-FE + 1JM, 2FM", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / XU20 (2001–2007)", "demo": true}, {"id": "research-5j6yh18533l003912", "yard": "demo", "year": 2003, "make": "Honda", "model": "Element", "trim": "", "row": "—", "vin": "5J6YH18533L003912", "engine": "4 Cyl, 2.359737216L, K24A4", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first and only generation / YH1/YH2 (2003–2011)", "demo": true}, {"id": "research-jtdkn3du1c1518674", "yard": "demo", "year": 2012, "make": "Toyota", "model": "Prius", "trim": "", "row": "—", "vin": "JTDKN3DU1C1518674", "engine": "4 Cyl, 1.8L, 2ZR-FXE+3JM", "body": "Hatchback/Liftback/Notchback", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / XW30 (2010–2015)", "demo": true}, {"id": "research-2gcec19k6p1198797", "yard": "demo", "year": 1993, "make": "Chevrolet", "model": "C/K 1500", "trim": "", "row": "—", "vin": "2GCEC19K6P1198797", "engine": "8 Cyl, 5.7L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / GMT400 (1988–1998)", "demo": true}, {"id": "research-3vw2k7aj9em333107", "yard": "demo", "year": 2014, "make": "Volkswagen", "model": "Jetta", "trim": "", "row": "—", "vin": "3VW2K7AJ9EM333107", "engine": "4 Cyl, 1.984000L", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "Mk6 (2011–2018)", "demo": true}, {"id": "research-1gcwgfca0c1158799", "yard": "demo", "year": 2012, "make": "Chevrolet", "model": "Express", "trim": "", "row": "—", "vin": "1GCWGFCA0C1158799", "engine": "8 Cyl, 4.8L, L20", "body": "Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first-generation facelift phase / GMT610", "demo": true}, {"id": "research-1gcgg25c381214236", "yard": "demo", "year": 2008, "make": "Chevrolet", "model": "Express", "trim": "", "row": "—", "vin": "1GCGG25C381214236", "engine": "8 Cyl, 4.8L, LY2", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first-generation facelift phase / GMT610", "demo": true}, {"id": "research-1gcgg25c681107925", "yard": "demo", "year": 2008, "make": "Chevrolet", "model": "Express", "trim": "", "row": "—", "vin": "1GCGG25C681107925", "engine": "8 Cyl, 4.8L, LY2", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first-generation facelift phase / GMT610", "demo": true}, {"id": "research-1gcwgfca1d1126249", "yard": "demo", "year": 2013, "make": "Chevrolet", "model": "Express", "trim": "", "row": "—", "vin": "1GCWGFCA1D1126249", "engine": "8 Cyl, 4.8L, L20 - Flex Fuel(Gas/Ethanol), SFI Iron", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first-generation facelift phase / GMT610", "demo": true}, {"id": "research-1gcwgfca4b1120863", "yard": "demo", "year": 2011, "make": "Chevrolet", "model": "Express", "trim": "", "row": "—", "vin": "1GCWGFCA4B1120863", "engine": "8 Cyl, 4.8L, L20", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first-generation facelift phase / GMT610", "demo": true}, {"id": "research-km8ju3ac0au011394", "yard": "demo", "year": 2010, "make": "Hyundai", "model": "Tucson", "trim": "", "row": "—", "vin": "KM8JU3AC0AU011394", "engine": "2.4L, DOHC theta ii", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / LM (2010–2015)", "demo": true}, {"id": "research-jthbn36f440150222", "yard": "demo", "year": 2004, "make": "Lexus", "model": "LS 430", "trim": "", "row": "—", "vin": "JTHBN36F440150222", "engine": "8 Cyl, 4.3L, 3UZ-FE", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / XF30/UCF30 (2001–2006)", "demo": true}, {"id": "research-jthbn36fx55018652", "yard": "demo", "year": 2005, "make": "Lexus", "model": "LS 430", "trim": "", "row": "—", "vin": "JTHBN36FX55018652", "engine": "8 Cyl, 4.3L, 3UZ-FE", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / XF30/UCF30 (2001–2006)", "demo": true}, {"id": "research-yv1612tk2f2362371", "yard": "demo", "year": 2015, "make": "Volvo", "model": "S60", "trim": "", "row": "—", "vin": "YV1612TK2F2362371", "engine": "5 Cyl, 2.5L, B5254T12", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation (2011–2018)", "demo": true}, {"id": "research-jtddr32t130151093", "yard": "demo", "year": 2003, "make": "Toyota", "model": "Celica", "trim": "", "row": "—", "vin": "JTDDR32T130151093", "engine": "4 Cyl, 1.8L, 1ZZ-FE", "body": "Hatchback/Liftback/Notchback", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "seventh generation / T230 (2000–2005)", "demo": true}, {"id": "research-wdbga70e3ta322841", "yard": "demo", "year": 1996, "make": "Mercedes-Benz", "model": "S-Class", "trim": "", "row": "—", "vin": "WDBGA70E3TA322841", "engine": "8 Cyl, 5L", "body": "Coupe", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "W140 (1992–1999)", "demo": true}, {"id": "research-1g6dg5e56c0109293", "yard": "demo", "year": 2012, "make": "Cadillac", "model": "CTS", "trim": "", "row": "—", "vin": "1G6DG5E56C0109293", "engine": "6 Cyl, 3.0L, LFW", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / Sigma II (2008–2014)", "demo": true}, {"id": "research-1ftew1cm2bfa69068", "yard": "demo", "year": 2011, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTEW1CM2BFA69068", "engine": "6 Cyl, 3.7L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "twelfth generation / P415 (2009–2014)", "demo": true}, {"id": "research-jhmfa36288s024434", "yard": "demo", "year": 2008, "make": "Honda", "model": "Civic Hybrid", "trim": "", "row": "—", "vin": "JHMFA36288S024434", "engine": "4 Cyl, 1.343739248L, LDA2", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "eighth generation / FA/FG (2006–2011)", "demo": true}, {"id": "research-jhmfa36298s025205", "yard": "demo", "year": 2008, "make": "Honda", "model": "Civic Hybrid", "trim": "", "row": "—", "vin": "JHMFA36298S025205", "engine": "4 Cyl, 1.343739248L, LDA2", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "eighth generation / FA/FG (2006–2011)", "demo": true}, {"id": "research-jhmfa362x8s001222", "yard": "demo", "year": 2008, "make": "Honda", "model": "Civic Hybrid", "trim": "", "row": "—", "vin": "JHMFA362X8S001222", "engine": "4 Cyl, 1.343739248L, LDA2", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "eighth generation / FA/FG (2006–2011)", "demo": true}, {"id": "research-wbabw33445pl36849", "yard": "demo", "year": 2005, "make": "BMW", "model": "3-Series", "trim": "", "row": "—", "vin": "WBABW33445PL36849", "engine": "6 Cyl, 2.5L", "body": "Convertible/Cabriolet", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "E46 (1999–2006)", "demo": true}, {"id": "research-ml32a3hj3hh020425", "yard": "demo", "year": 2017, "make": "Mitsubishi", "model": "Mirage", "trim": "", "row": "—", "vin": "ML32A3HJ3HH020425", "engine": "3 Cyl, 1.2L", "body": "Hatchback/Liftback/Notchback", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "5 (U.S.; global 6th) (2014–2024)", "demo": true}, {"id": "research-5xxgt4l32gg077903", "yard": "demo", "year": 2016, "make": "Kia", "model": "Optima", "trim": "", "row": "—", "vin": "5XXGT4L32GG077903", "engine": "4 Cyl, 2.4L, T-GDI THETA II", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / JF (2016–2020)", "demo": true}, {"id": "research-1n4al3ap8hc483388", "yard": "demo", "year": 2017, "make": "Nissan", "model": "Altima", "trim": "", "row": "—", "vin": "1N4AL3AP8HC483388", "engine": "4 Cyl, 2.5L", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "L33 generation / L33 (2013–2018)", "demo": true}, {"id": "research-1n4al3ap0hc180962", "yard": "demo", "year": 2017, "make": "Nissan", "model": "Altima", "trim": "", "row": "—", "vin": "1N4AL3AP0HC180962", "engine": "4 Cyl, 2.5L", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "L33 generation / L33 (2013–2018)", "demo": true}, {"id": "research-1n4al3ap8gc279964", "yard": "demo", "year": 2016, "make": "Nissan", "model": "Altima", "trim": "", "row": "—", "vin": "1N4AL3AP8GC279964", "engine": "4 Cyl, 2.5L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "L33 generation / L33 (2013–2018)", "demo": true}, {"id": "research-1gyek63n94r311853", "yard": "demo", "year": 2004, "make": "Cadillac", "model": "Escalade", "trim": "", "row": "—", "vin": "1GYEK63N94R311853", "engine": "8 Cyl, 6.0L, LQ9", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "", "generation": "second generation / GMT800 (2002–2006)", "demo": true}, {"id": "research-3fahp0ja4cr128595", "yard": "demo", "year": 2012, "make": "Ford", "model": "Fusion", "trim": "", "row": "—", "vin": "3FAHP0JA4CR128595", "engine": "4 Cyl, 2.5L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / CD3 (2006–2012)", "demo": true}, {"id": "research-3fahp0ja4cr174816", "yard": "demo", "year": 2012, "make": "Ford", "model": "Fusion", "trim": "", "row": "—", "vin": "3FAHP0JA4CR174816", "engine": "4 Cyl, 2.5L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / CD3 (2006–2012)", "demo": true}, {"id": "research-3fahp0ja5ar173185", "yard": "demo", "year": 2010, "make": "Ford", "model": "Fusion", "trim": "", "row": "—", "vin": "3FAHP0JA5AR173185", "engine": "4 Cyl, 2.5L, Ford", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / CD3 (2006–2012)", "demo": true}, {"id": "research-km8sr4hf0fu107545", "yard": "demo", "year": 2015, "make": "Hyundai", "model": "Santa Fe", "trim": "", "row": "—", "vin": "KM8SR4HF0FU107545", "engine": "3.3L, DOHC GDI LAMBDA II", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third-generation three-row body / NC (2013–2018)", "demo": true}, {"id": "research-kndjt2a57d7496400", "yard": "demo", "year": 2013, "make": "Kia", "model": "Soul", "trim": "", "row": "—", "vin": "KNDJT2A57D7496400", "engine": "1.6L, DOHC GDI GAMMA", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / AM (2010–2013)", "demo": true}, {"id": "research-kndjt2a54c7453860", "yard": "demo", "year": 2012, "make": "Kia", "model": "Soul", "trim": "", "row": "—", "vin": "KNDJT2A54C7453860", "engine": "1.6L, DOHC GDI GAMMA", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / AM (2010–2013)", "demo": true}, {"id": "research-2hnyd18873h505891", "yard": "demo", "year": 2003, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "2HNYD18873H505891", "engine": "6 Cyl, 3.474057568L, J35A5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / YD1 (2001–2006)", "demo": true}, {"id": "research-2hnyd18784h535166", "yard": "demo", "year": 2004, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "2HNYD18784H535166", "engine": "6 Cyl, 3.474057568L, J35A5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / YD1 (2001–2006)", "demo": true}, {"id": "research-2hnyd18633h554133", "yard": "demo", "year": 2003, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "2HNYD18633H554133", "engine": "6 Cyl, 3.474057568L, J35A5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / YD1 (2001–2006)", "demo": true}, {"id": "research-1ftfw1et4dkd45981", "yard": "demo", "year": 2013, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTFW1ET4DKD45981", "engine": "6 Cyl, 3.5L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "twelfth generation / P415 (2009–2014)", "demo": true}, {"id": "research-jt8bh22f9t0040269", "yard": "demo", "year": 1996, "make": "Lexus", "model": "LS 400", "trim": "", "row": "—", "vin": "JT8BH22F9T0040269", "engine": "8 Cyl, 4.0L, 1UZ-FE", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / XF20/UCF20 (1995–2000)", "demo": true}, {"id": "research-jn8ae2kpxc9048072", "yard": "demo", "year": 2012, "make": "Nissan", "model": "Quest", "trim": "", "row": "—", "vin": "JN8AE2KPXC9048072", "engine": "3.5L", "body": "Minivan", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "RE52 generation / RE52 (2011–2017)", "demo": true}, {"id": "research-3vwdp7aj7cm007345", "yard": "demo", "year": 2012, "make": "Volkswagen", "model": "Jetta", "trim": "", "row": "—", "vin": "3VWDP7AJ7CM007345", "engine": "5 Cyl, 2.480000L", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "Mk6 (2011–2018)", "demo": true}, {"id": "research-3vwlp7aj1cm327272", "yard": "demo", "year": 2012, "make": "Volkswagen", "model": "Jetta", "trim": "", "row": "—", "vin": "3VWLP7AJ1CM327272", "engine": "5 Cyl, 2.480000L", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "Mk6 (2011–2018)", "demo": true}, {"id": "research-4t1ca38p96u102312", "yard": "demo", "year": 2006, "make": "Toyota", "model": "Camry Solara", "trim": "", "row": "—", "vin": "4T1CA38P96U102312", "engine": "6 Cyl, 3.3L, 3MZ-FE", "body": "Coupe", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / XV30 (2004–2008)", "demo": true}, {"id": "research-4t1ca30p75u041679", "yard": "demo", "year": 2005, "make": "Toyota", "model": "Camry Solara", "trim": "", "row": "—", "vin": "4T1CA30P75U041679", "engine": "6 Cyl, 3.3L, 3MZ-FE", "body": "Coupe", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / XV30 (2004–2008)", "demo": true}, {"id": "research-1ftnf21l9xec06441", "yard": "demo", "year": 1999, "make": "Ford", "model": "F-250 SD", "trim": "", "row": "—", "vin": "1FTNF21L9XEC06441", "engine": "8 Cyl, 5.4L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / P221 (1999–2007)", "demo": true}, {"id": "research-1fadp3k20el417790", "yard": "demo", "year": 2014, "make": "Ford", "model": "Focus", "trim": "", "row": "—", "vin": "1FADP3K20EL417790", "engine": "4 Cyl, 2.0L", "body": "Hatchback/Liftback/Notchback", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third U.S. generation / C346 (2012–2018)", "demo": true}, {"id": "research-1fadp3f23el205041", "yard": "demo", "year": 2014, "make": "Ford", "model": "Focus", "trim": "", "row": "—", "vin": "1FADP3F23EL205041", "engine": "4 Cyl, 2.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third U.S. generation / C346 (2012–2018)", "demo": true}, {"id": "research-1n4al3ap2dc905228", "yard": "demo", "year": 2013, "make": "Nissan", "model": "Altima", "trim": "", "row": "—", "vin": "1N4AL3AP2DC905228", "engine": "4 Cyl, 2.5L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "L33 generation / L33 (2013–2018)", "demo": true}, {"id": "research-5ltpw18536fj06271", "yard": "demo", "year": 2006, "make": "Lincoln", "model": "Mark LT", "trim": "", "row": "—", "vin": "5LTPW18536FJ06271", "engine": "8 Cyl, 5.4L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first and only U.S. generation / P221 (2006–2008)", "demo": true}, {"id": "research-wbaam3332xca83763", "yard": "demo", "year": 1999, "make": "BMW", "model": "3-Series", "trim": "", "row": "—", "vin": "WBAAM3332XCA83763", "engine": "6 Cyl, 2.49L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "E46 (1999–2006)", "demo": true}, {"id": "research-1ftne2ew8cda96957", "yard": "demo", "year": 2012, "make": "Ford", "model": "Econoline", "trim": "", "row": "—", "vin": "1FTNE2EW8CDA96957", "engine": "8 Cyl, 4.6L, Ford", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "Fourth generation (1992–present) (1992–2014)", "demo": true}, {"id": "research-1ftse3es4eda28308", "yard": "demo", "year": 2014, "make": "Ford", "model": "Econoline", "trim": "", "row": "—", "vin": "1FTSE3ES4EDA28308", "engine": "10 Cyl, 6.8L, Ford", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "Fourth generation (1992–present) (1992–2014)", "demo": true}, {"id": "research-1ftne2ew0eda10320", "yard": "demo", "year": 2014, "make": "Ford", "model": "Econoline", "trim": "", "row": "—", "vin": "1FTNE2EW0EDA10320", "engine": "8 Cyl, 4.6L, Ford", "body": "Cargo Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "Fourth generation (1992–present) (1992–2014)", "demo": true}, {"id": "research-wbafr7c5xbc267452", "yard": "demo", "year": 2011, "make": "BMW", "model": "5-Series", "trim": "", "row": "—", "vin": "WBAFR7C5XBC267452", "engine": "6 Cyl, 3.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "F10 (2011–2016)", "demo": true}, {"id": "research-4s3bmcg67c3012139", "yard": "demo", "year": 2012, "make": "Subaru", "model": "Legacy", "trim": "", "row": "—", "vin": "4S3BMCG67C3012139", "engine": "2.5L, 2.5NA U6", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "", "generation": "fifth generation / BM/BR (2010–2014)", "demo": true}, {"id": "research-wvgav7ax4cw557775", "yard": "demo", "year": 2012, "make": "Volkswagen", "model": "Tiguan", "trim": "", "row": "—", "vin": "WVGAV7AX4CW557775", "engine": "4 Cyl, 1.984000L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "1st generation (2009–2018)", "demo": true}, {"id": "research-2hnyd18642h524766", "yard": "demo", "year": 2002, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "2HNYD18642H524766", "engine": "6 Cyl, 3.474057568L, J35A3", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / YD1 (2001–2006)", "demo": true}, {"id": "research-2hnyd18292h535856", "yard": "demo", "year": 2002, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "2HNYD18292H535856", "engine": "6 Cyl, 3.474057568L, J35A3", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / YD1 (2001–2006)", "demo": true}, {"id": "research-3gyfk66n25g163868", "yard": "demo", "year": 2005, "make": "Cadillac", "model": "Escalade", "trim": "", "row": "—", "vin": "3GYFK66N25G163868", "engine": "8 Cyl, 6.0L, LQ9", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "", "generation": "second generation / GMT800 (2002–2006)", "demo": true}, {"id": "research-wvgav7ax6aw501978", "yard": "demo", "year": 2010, "make": "Volkswagen", "model": "Tiguan", "trim": "", "row": "—", "vin": "WVGAV7AX6AW501978", "engine": "4 Cyl, 1.984000L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "1st generation (2009–2018)", "demo": true}, {"id": "research-2g4gk5ex3f9143000", "yard": "demo", "year": 2015, "make": "Buick", "model": "Regal", "trim": "", "row": "—", "vin": "2G4GK5EX3F9143000", "engine": "4 Cyl, 2.0L, LTG", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fifth generation / Epsilon II (2011–2017)", "demo": true}, {"id": "research-wa1wkafp8ba092190", "yard": "demo", "year": 2011, "make": "Audi", "model": "Q5", "trim": "", "row": "—", "vin": "WA1WKAFP8BA092190", "engine": "6 Cyl, 3.197000L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "1st generation (2009–2017)", "demo": true}, {"id": "research-jt8bf22g6v0024693", "yard": "demo", "year": 1997, "make": "Lexus", "model": "ES 300", "trim": "", "row": "—", "vin": "JT8BF22G6V0024693", "engine": "6 Cyl, 3.0L, 1MZ-FE", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / XV20/MCV20 (1997–2001)", "demo": true}, {"id": "research-jh4cl96856c023365", "yard": "demo", "year": 2006, "make": "Acura", "model": "TSX", "trim": "", "row": "—", "vin": "JH4CL96856C023365", "engine": "4 Cyl, 2.359737216L, K24A2", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / CL9 (2004–2008)", "demo": true}, {"id": "research-4t4bf1fk0fr488696", "yard": "demo", "year": 2015, "make": "Toyota", "model": "Camry", "trim": "", "row": "—", "vin": "4T4BF1FK0FR488696", "engine": "4 Cyl, 2.5L, 2AR-FE", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "seventh U.S. wide-body generation / XV50 (2012–2017)", "demo": true}, {"id": "research-wbanf735x7cu21413", "yard": "demo", "year": 2007, "make": "BMW", "model": "5-Series", "trim": "", "row": "—", "vin": "WBANF735X7CU21413", "engine": "6 Cyl, 3.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "E60/E61 (2004–2010)", "demo": true}, {"id": "research-wbanf73567cu24538", "yard": "demo", "year": 2007, "make": "BMW", "model": "5-Series", "trim": "", "row": "—", "vin": "WBANF73567CU24538", "engine": "6 Cyl, 3.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "E60/E61 (2004–2010)", "demo": true}, {"id": "research-2mefm75wxxx648802", "yard": "demo", "year": 1999, "make": "Mercury", "model": "Grand Marquis", "trim": "", "row": "—", "vin": "2MEFM75WXXX648802", "engine": "8 Cyl, 4.6L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / Panther M75 (1998–2011)", "demo": true}, {"id": "research-1hgej6125wl089353", "yard": "demo", "year": 1998, "make": "Honda", "model": "Civic", "trim": "Base", "row": "—", "vin": "1HGEJ6125WL089353", "engine": "4 Cyl, 1.589545208L, D16Y7", "body": "Coupe", "transmission": "manual", "drivetrain": "", "fuel": "Gasoline", "generation": "sixth generation / EK/EJ/EM (1996–2000)", "demo": true}, {"id": "research-wdbuf87x98b331739", "yard": "demo", "year": 2008, "make": "Mercedes-Benz", "model": "E-Class", "trim": "", "row": "—", "vin": "WDBUF87X98B331739", "engine": "6 Cyl, 3.5L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "W211 (2003–2009)", "demo": true}, {"id": "research-1fmdu77k24ua69806", "yard": "demo", "year": 2004, "make": "Ford", "model": "Explorer Sport Trac", "trim": "", "row": "—", "vin": "1FMDU77K24UA69806", "engine": "6 Cyl, 4.0L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / UN105 (2001–2005)", "demo": true}, {"id": "research-kmhdu46d29u767678", "yard": "demo", "year": 2009, "make": "Hyundai", "model": "Elantra", "trim": "", "row": "—", "vin": "KMHDU46D29U767678", "engine": "2.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / HD (2007–2010)", "demo": true}, {"id": "research-kmhdu4ad3au148521", "yard": "demo", "year": 2010, "make": "Hyundai", "model": "Elantra", "trim": "", "row": "—", "vin": "KMHDU4AD3AU148521", "engine": "4 Cyl, 2.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / HD (2007–2010)", "demo": true}, {"id": "research-kmhdu4ad1au179573", "yard": "demo", "year": 2010, "make": "Hyundai", "model": "Elantra", "trim": "", "row": "—", "vin": "KMHDU4AD1AU179573", "engine": "4 Cyl, 2.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / HD (2007–2010)", "demo": true}, {"id": "research-jtlkt324164052728", "yard": "demo", "year": 2006, "make": "Scion", "model": "xB", "trim": "", "row": "—", "vin": "JTLKT324164052728", "engine": "4 Cyl, 1.5L, INZ-FE", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / NCP31 (2004–2006)", "demo": true}, {"id": "research-jf2sjahc0eh491903", "yard": "demo", "year": 2014, "make": "Subaru", "model": "Forester", "trim": "", "row": "—", "vin": "JF2SJAHC0EH491903", "engine": "4 Cyl, 2.5L, 2.5NA U5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / SJ (2014–2018)", "demo": true}, {"id": "research-5npe24af0fh171384", "yard": "demo", "year": 2015, "make": "Hyundai", "model": "Sonata", "trim": "", "row": "—", "vin": "5NPE24AF0FH171384", "engine": "2.4L, DOHC GDI THETA-II", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "LF generation / LF (2015–2019)", "demo": true}, {"id": "research-4a3ak64f57e073438", "yard": "demo", "year": 2007, "make": "Mitsubishi", "model": "Eclipse", "trim": "", "row": "—", "vin": "4A3AK64F57E073438", "engine": "2.4L", "body": "Hatchback/Liftback/Notchback", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "4 (2006–2012)", "demo": true}, {"id": "research-2hnyd18616h547122", "yard": "demo", "year": 2006, "make": "Acura", "model": "MDX", "trim": "", "row": "—", "vin": "2HNYD18616H547122", "engine": "6 Cyl, 3.474057568L, J35A5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / YD1 (2001–2006)", "demo": true}, {"id": "research-nm0ls7bn0ct107042", "yard": "demo", "year": 2012, "make": "Ford", "model": "Transit Connect", "trim": "", "row": "—", "vin": "NM0LS7BN0CT107042", "engine": "4 Cyl, 2.0L, Ford", "body": "Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first U.S. generation / V227 (2010–2013)", "demo": true}, {"id": "research-nm0ls7an2at028907", "yard": "demo", "year": 2010, "make": "Ford", "model": "Transit Connect", "trim": "", "row": "—", "vin": "NM0LS7AN2AT028907", "engine": "4 Cyl, 2.0L, Ford", "body": "Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first U.S. generation / V227 (2010–2013)", "demo": true}, {"id": "research-nm0ls7an7bt057255", "yard": "demo", "year": 2011, "make": "Ford", "model": "Transit Connect", "trim": "", "row": "—", "vin": "NM0LS7AN7BT057255", "engine": "4 Cyl, 2.0L, Ford", "body": "Van", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first U.S. generation / V227 (2010–2013)", "demo": true}, {"id": "research-1gkdt13s632197930", "yard": "demo", "year": 2003, "make": "GMC", "model": "Envoy", "trim": "", "row": "—", "vin": "1GKDT13S632197930", "engine": "6 Cyl, 4.2L, LL8", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "standalone generation / GMT360 (2002–2009)", "demo": true}, {"id": "research-1gkdt13s362246747", "yard": "demo", "year": 2006, "make": "GMC", "model": "Envoy", "trim": "", "row": "—", "vin": "1GKDT13S362246747", "engine": "6 Cyl, 4.2L, LL8", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "standalone generation / GMT360 (2002–2009)", "demo": true}, {"id": "research-1gket16s246192864", "yard": "demo", "year": 2004, "make": "GMC", "model": "Envoy", "trim": "", "row": "—", "vin": "1GKET16S246192864", "engine": "6 Cyl, 4.2L, LL8", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "standalone generation / GMT360 (2002–2009)", "demo": true}, {"id": "research-kndpb3a28c7224560", "yard": "demo", "year": 2012, "make": "Kia", "model": "Sportage", "trim": "", "row": "—", "vin": "KNDPB3A28C7224560", "engine": "2.4L, DOHC MPI Theta-II", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / SL (2011–2016)", "demo": true}, {"id": "research-4t1bb46k39u075361", "yard": "demo", "year": 2009, "make": "Toyota", "model": "Camry Hybrid", "trim": "", "row": "—", "vin": "4T1BB46K39U075361", "engine": "4 Cyl, 2.4L, 2AZ-FXE+2JM", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "sixth U.S. wide-body generation / XV40 (2007–2011)", "demo": true}, {"id": "research-5tdbk23c78s020341", "yard": "demo", "year": 2008, "make": "Toyota", "model": "Sienna", "trim": "", "row": "—", "vin": "5TDBK23C78S020341", "engine": "6 Cyl, 3.5L, 2GR-FE", "body": "Minivan", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / XL20 (2004–2010)", "demo": true}, {"id": "research-5tdzk23c98s189047", "yard": "demo", "year": 2008, "make": "Toyota", "model": "Sienna", "trim": "", "row": "—", "vin": "5TDZK23C98S189047", "engine": "6 Cyl, 3.5L, 2GR-FE", "body": "Minivan", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / XL20 (2004–2010)", "demo": true}, {"id": "research-1hgcp26349a069756", "yard": "demo", "year": 2009, "make": "Honda", "model": "Accord", "trim": "", "row": "—", "vin": "1HGCP26349A069756", "engine": "4 Cyl, 2.359737216L, K24Z2", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "eighth generation / CP/CS (2008–2012)", "demo": true}, {"id": "research-1g1bl5374pw144799", "yard": "demo", "year": 1993, "make": "Chevrolet", "model": "Caprice", "trim": "", "row": "—", "vin": "1G1BL5374PW144799", "engine": "8 Cyl, 5.7L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / B-body 1991-1996 (1991–1996)", "demo": true}, {"id": "research-jh4db7666vs001048", "yard": "demo", "year": 1997, "make": "Acura", "model": "Integra", "trim": "", "row": "—", "vin": "JH4DB7666VS001048", "engine": "4 Cyl, 1.835351168L, B18B1", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / DC/DB (1994–2001)", "demo": true}, {"id": "research-jn8at2mt5hw395012", "yard": "demo", "year": 2017, "make": "Nissan", "model": "Rogue", "trim": "", "row": "—", "vin": "JN8AT2MT5HW395012", "engine": "4 Cyl, 2.5L", "body": "Crossover Utility Vehicle [CUV]", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "T32 generation / T32 (2014–2020)", "demo": true}, {"id": "research-knmat2mt3hp510471", "yard": "demo", "year": 2017, "make": "Nissan", "model": "Rogue", "trim": "", "row": "—", "vin": "KNMAT2MT3HP510471", "engine": "4 Cyl, 2.5L", "body": "Crossover Utility Vehicle [CUV]", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "T32 generation / T32 (2014–2020)", "demo": true}, {"id": "research-1ftrx14w55kb91823", "yard": "demo", "year": 2005, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTRX14W55KB91823", "engine": "8 Cyl, 4.6L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "eleventh generation / P221 (2004–2008)", "demo": true}, {"id": "research-1ftrx12w47na07766", "yard": "demo", "year": 2007, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTRX12W47NA07766", "engine": "8 Cyl, 4.6L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "eleventh generation / P221 (2004–2008)", "demo": true}, {"id": "research-1ftpf12565na81818", "yard": "demo", "year": 2005, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTPF12565NA81818", "engine": "8 Cyl, 5.4L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "eleventh generation / P221 (2004–2008)", "demo": true}, {"id": "research-2melm74wxvx643178", "yard": "demo", "year": 1997, "make": "Mercury", "model": "Grand Marquis", "trim": "", "row": "—", "vin": "2MELM74WXVX643178", "engine": "8 Cyl, 4.6L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / Panther M74 (1992–1997)", "demo": true}, {"id": "research-2lmdj6jk7ebl02537", "yard": "demo", "year": 2014, "make": "Lincoln", "model": "MKX", "trim": "", "row": "—", "vin": "2LMDJ6JK7EBL02537", "engine": "6 Cyl, 3.7L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / U388 (2007–2015)", "demo": true}, {"id": "research-2fmdk3kc9dbb18178", "yard": "demo", "year": 2013, "make": "Ford", "model": "Edge", "trim": "", "row": "—", "vin": "2FMDK3KC9DBB18178", "engine": "6 Cyl, 3.5L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / U387 (2007–2014)", "demo": true}, {"id": "research-2fmdk3jc2bba42320", "yard": "demo", "year": 2011, "make": "Ford", "model": "Edge", "trim": "", "row": "—", "vin": "2FMDK3JC2BBA42320", "engine": "6 Cyl, 3.5L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / U387 (2007–2014)", "demo": true}, {"id": "research-1fmeu7de6aua03404", "yard": "demo", "year": 2010, "make": "Ford", "model": "Explorer", "trim": "", "row": "—", "vin": "1FMEU7DE6AUA03404", "engine": "6 Cyl, 4.0L, Ford", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / U251 (2006–2010)", "demo": true}, {"id": "research-1d7hw48n45s200034", "yard": "demo", "year": 2005, "make": "Dodge", "model": "Dakota", "trim": "", "row": "—", "vin": "1D7HW48N45S200034", "engine": "8 Cyl, 4.7L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / ND (2005–2010)", "demo": true}, {"id": "research-2c4rdgcg4dr727098", "yard": "demo", "year": 2013, "make": "Dodge", "model": "Grand Caravan", "trim": "", "row": "—", "vin": "2C4RDGCG4DR727098", "engine": "6 Cyl, 3.6L", "body": "Minivan", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fifth generation / RT (2008–2020)", "demo": true}, {"id": "research-1j4gl48kx2w116061", "yard": "demo", "year": 2002, "make": "Jeep", "model": "Liberty", "trim": "", "row": "—", "vin": "1J4GL48KX2W116061", "engine": "6 Cyl, 3.7L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation/Cherokee successor / KJ (2002–2007)", "demo": true}, {"id": "research-1j4gl58k56w163784", "yard": "demo", "year": 2006, "make": "Jeep", "model": "Liberty", "trim": "", "row": "—", "vin": "1J4GL58K56W163784", "engine": "6 Cyl, 3.7L, Magnum", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation/Cherokee successor / KJ (2002–2007)", "demo": true}, {"id": "research-1j4gl48k45w517836", "yard": "demo", "year": 2005, "make": "Jeep", "model": "Liberty", "trim": "", "row": "—", "vin": "1J4GL48K45W517836", "engine": "6 Cyl, 3.7L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation/Cherokee successor / KJ (2002–2007)", "demo": true}, {"id": "research-1g6kd54y1vu257147", "yard": "demo", "year": 1997, "make": "Cadillac", "model": "Deville", "trim": "", "row": "—", "vin": "1G6KD54Y1VU257147", "engine": "8 Cyl, 4.6L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "", "generation": "seventh generation / K-body (1994–1999)", "demo": true}, {"id": "research-wbabs33473pg89341", "yard": "demo", "year": 2003, "make": "BMW", "model": "3-Series", "trim": "", "row": "—", "vin": "WBABS33473PG89341", "engine": "6 Cyl", "body": "Convertible/Cabriolet", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "E46 (1999–2006)", "demo": true}, {"id": "research-jf1gpat66fh317636", "yard": "demo", "year": 2015, "make": "Subaru", "model": "Impreza", "trim": "", "row": "—", "vin": "JF1GPAT66FH317636", "engine": "4 Cyl, 2.0L, 2.0L NA", "body": "Wagon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / GJ/GP (2012–2016)", "demo": true}, {"id": "research-1gnskke35br278660", "yard": "demo", "year": 2011, "make": "Chevrolet", "model": "Suburban", "trim": "", "row": "—", "vin": "1GNSKKE35BR278660", "engine": "8 Cyl, 5.3L, LC9", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Flexible Fuel Vehicle (FFV)", "generation": "eleventh generation / GMT900 (2007–2014)", "demo": true}, {"id": "research-5tdbt48a51s054817", "yard": "demo", "year": 2001, "make": "Toyota", "model": "Sequoia", "trim": "", "row": "—", "vin": "5TDBT48A51S054817", "engine": "8 Cyl, 4.7L, 2UZ-FE", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / XK30/XK40 (2001–2007)", "demo": true}, {"id": "research-1g1jc5sh5d4173547", "yard": "demo", "year": 2013, "make": "Chevrolet", "model": "Sonic", "trim": "", "row": "—", "vin": "1G1JC5SH5D4173547", "engine": "4 Cyl, 1.8L, LUW", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first and only U.S. generation / Gamma II/T300 (2012–2020)", "demo": true}, {"id": "research-jf2sjagc8fh560582", "yard": "demo", "year": 2015, "make": "Subaru", "model": "Forester", "trim": "", "row": "—", "vin": "JF2SJAGC8FH560582", "engine": "4 Cyl, 2.5L, 2.5NA U5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / SJ (2014–2018)", "demo": true}, {"id": "research-4s4brbmc6e3317412", "yard": "demo", "year": 2014, "make": "Subaru", "model": "Outback", "trim": "", "row": "—", "vin": "4S4BRBMC6E3317412", "engine": "4 Cyl, 2.5L, 2.5NA U5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / BR (2010–2014)", "demo": true}, {"id": "research-4s4brdkc9d2244832", "yard": "demo", "year": 2013, "make": "Subaru", "model": "Outback", "trim": "", "row": "—", "vin": "4S4BRDKC9D2244832", "engine": "3.6L, 3.6NA U5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "", "fuel": "", "generation": "fourth generation / BR (2010–2014)", "demo": true}, {"id": "research-4s4brcac0e3251417", "yard": "demo", "year": 2014, "make": "Subaru", "model": "Outback", "trim": "", "row": "—", "vin": "4S4BRCAC0E3251417", "engine": "2.5L, 2.5NA U6", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "cvt", "drivetrain": "", "fuel": "", "generation": "fourth generation / BR (2010–2014)", "demo": true}, {"id": "research-5n1az2mh4fn201588", "yard": "demo", "year": 2015, "make": "Nissan", "model": "Murano", "trim": "", "row": "—", "vin": "5N1AZ2MH4FN201588", "engine": "6 Cyl, 3.5L", "body": "Crossover Utility Vehicle [CUV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "Z52 generation / Z52 (2015–2024)", "demo": true}, {"id": "research-jtehf21ax20072486", "yard": "demo", "year": 2002, "make": "Toyota", "model": "Highlander", "trim": "", "row": "—", "vin": "JTEHF21AX20072486", "engine": "6 Cyl, 3.0L, 1MZ-FE", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / XU20 (2001–2007)", "demo": true}, {"id": "research-jtehf21a910006073", "yard": "demo", "year": 2001, "make": "Toyota", "model": "Highlander", "trim": "", "row": "—", "vin": "JTEHF21A910006073", "engine": "6 Cyl, 3.0L, 1MZ-FE", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "first generation / XU20 (2001–2007)", "demo": true}, {"id": "research-1j4fy19s1wp720821", "yard": "demo", "year": 1998, "make": "Jeep", "model": "Wrangler", "trim": "", "row": "—", "vin": "1J4FY19S1WP720821", "engine": "6 Cyl, 4L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / TJ (1997–2006)", "demo": true}, {"id": "research-1fmhk7f81cga31767", "yard": "demo", "year": 2012, "make": "Ford", "model": "Explorer", "trim": "", "row": "—", "vin": "1FMHK7F81CGA31767", "engine": "6 Cyl, 3.5L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fifth generation / U502 (2011–2019)", "demo": true}, {"id": "research-jm1bl1sf6a1202599", "yard": "demo", "year": 2010, "make": "Mazda", "model": "Mazda3", "trim": "", "row": "—", "vin": "JM1BL1SF6A1202599", "engine": "2.0L, LFX Federal", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "second generation / BL (2010–2013)", "demo": true}, {"id": "research-4s3bmbg63d3017494", "yard": "demo", "year": 2013, "make": "Subaru", "model": "Legacy", "trim": "", "row": "—", "vin": "4S3BMBG63D3017494", "engine": "4 Cyl, 2.5L, 2.5NA U5", "body": "Sedan/Saloon", "transmission": "cvt", "drivetrain": "", "fuel": "Gasoline", "generation": "fifth generation / BM/BR (2010–2014)", "demo": true}, {"id": "research-1gnek13r7xj383804", "yard": "demo", "year": 1999, "make": "Chevrolet", "model": "Tahoe", "trim": "", "row": "—", "vin": "1GNEK13R7XJ383804", "engine": "8 Cyl, 5.7L", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "", "generation": "first generation / GMT400 (1995–1999)", "demo": true}, {"id": "research-1gnek13t21r203228", "yard": "demo", "year": 2001, "make": "Chevrolet", "model": "Tahoe", "trim": "", "row": "—", "vin": "1GNEK13T21R203228", "engine": "8 Cyl, 5.3L, LM7", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "", "generation": "second generation / GMT800 (2000–2006)", "demo": true}, {"id": "research-1gnek13z62r219258", "yard": "demo", "year": 2002, "make": "Chevrolet", "model": "Tahoe", "trim": "", "row": "—", "vin": "1GNEK13Z62R219258", "engine": "8 Cyl, 5.3L, L59", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "", "drivetrain": "", "fuel": "Flexible Fuel Vehicle (FFV)", "generation": "second generation / GMT800 (2000–2006)", "demo": true}, {"id": "research-1gcec14mxvz214299", "yard": "demo", "year": 1997, "make": "Chevrolet", "model": "C/K 1500", "trim": "", "row": "—", "vin": "1GCEC14MXVZ214299", "engine": "8 Cyl, 5L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "fourth generation / GMT400 (1988–1998)", "demo": true}, {"id": "research-1g1jd5sh3j4140717", "yard": "demo", "year": 2018, "make": "Chevrolet", "model": "Sonic", "trim": "", "row": "—", "vin": "1G1JD5SH3J4140717", "engine": "4 Cyl, 1.8L, LUW - MFI, E85 MAX", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "first and only U.S. generation / Gamma II/T300 (2012–2020)", "demo": true}, {"id": "research-2g1wx12k939312234", "yard": "demo", "year": 2003, "make": "Chevrolet", "model": "Monte Carlo", "trim": "SS", "row": "—", "vin": "2G1WX12K939312234", "engine": "6 Cyl, 3.8L, L36", "body": "Coupe", "transmission": "", "drivetrain": "", "fuel": "", "generation": "sixth generation / W-body (2000–2007)", "demo": true}, {"id": "research-1ftfw1ev5afb95255", "yard": "demo", "year": 2010, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTFW1EV5AFB95255", "engine": "8 Cyl, 5.4L, Ford", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "twelfth generation / P415 (2009–2014)", "demo": true}, {"id": "research-1ftpx14v49fb08511", "yard": "demo", "year": 2009, "make": "Ford", "model": "F-150", "trim": "", "row": "—", "vin": "1FTPX14V49FB08511", "engine": "8 Cyl, 5.4L", "body": "Pickup", "transmission": "", "drivetrain": "", "fuel": "Flexible Fuel Vehicle (FFV)", "generation": "twelfth generation / P415 (2009–2014)", "demo": true}, {"id": "research-1fadp3j26dl203760", "yard": "demo", "year": 2013, "make": "Ford", "model": "Focus", "trim": "", "row": "—", "vin": "1FADP3J26DL203760", "engine": "4 Cyl, 2.0L", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third U.S. generation / C346 (2012–2018)", "demo": true}, {"id": "research-4s4brdlc4b2435649", "yard": "demo", "year": 2011, "make": "Subaru", "model": "Outback", "trim": "Limited +M/R+/Navi", "row": "—", "vin": "4S4BRDLC4B2435649", "engine": "3.6L, 3.6 NA U5", "body": "Sport Utility Vehicle [SUV]/Multipurpose Vehicle [MPV]", "transmission": "automatic", "drivetrain": "AWD/All-Wheel Drive", "fuel": "", "generation": "fourth generation / BR (2010–2014)", "demo": true}, {"id": "research-jm1gj1u51g1409961", "yard": "demo", "year": 2016, "make": "Mazda", "model": "Mazda6", "trim": "Sport/GX", "row": "—", "vin": "JM1GJ1U51G1409961", "engine": "4 Cyl, 2.5L, PY", "body": "Sedan/Saloon", "transmission": "", "drivetrain": "", "fuel": "Gasoline", "generation": "third generation / GJ/GL (2014–2021)", "demo": true}, {"id": "research-waudfafc5cn134675", "yard": "demo", "year": 2012, "make": "Audi", "model": "A6", "trim": "", "row": "—", "vin": "WAUDFAFC5CN134675", "engine": "4 Cyl, 1.984000L", "body": "Sedan/Saloon", "transmission": "automatic", "drivetrain": "", "fuel": "Gasoline", "generation": "C7 (2012–2018)", "demo": true}];
const KEY='pulllist-v1';let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch{};if(!db||!Array.isArray(db.parts)||!Array.isArray(db.cars))db={parts:structuredClone(SEED_PARTS),cars:[],hidden:[],dark:false,fee:13.25,other:0};db.hidden??=[];db.fee??=13.25;db.other??=0;db.parts.forEach(p=>{p.id??=crypto.randomUUID()});
// Merge newly released seed recommendations without overwriting user edits or removals.
if(!db.seedUpdatesApplied)db.seedUpdatesApplied=[];
if(!db.seedUpdatesApplied.includes('audi-a6-v3')) { for(const part of SEED_PARTS.filter(p=>p.id.startsWith('seed-audi-'))) { if(!db.parts.some(existing=>existing.id===part.id))db.parts.push(structuredClone(part)); } db.seedUpdatesApplied.push('audi-a6-v3'); try{localStorage.setItem(KEY,JSON.stringify(db))}catch{} }
if(!db.seedUpdatesApplied.includes('ford-f250-v4')) { for(const part of SEED_PARTS.filter(p=>p.id.startsWith('seed-ford-f250-'))) { if(!db.parts.some(existing=>existing.id===part.id))db.parts.push(structuredClone(part)); } db.seedUpdatesApplied.push('ford-f250-v4'); try{localStorage.setItem(KEY,JSON.stringify(db))}catch{} }
if(!db.seedUpdatesApplied.includes('batch-v5')) { for(const part of SEED_PARTS.filter(p=>p.id.startsWith('seed-batch-v5-'))) { if(!db.parts.some(existing=>existing.id===part.id))db.parts.push(structuredClone(part)); } db.seedUpdatesApplied.push('batch-v5'); try{localStorage.setItem(KEY,JSON.stringify(db))}catch{} }
if(!db.seedUpdatesApplied.includes('batch-v6')) { for(const part of SEED_PARTS.filter(p=>p.id.startsWith('seed-batch-v6-'))) { if(!db.parts.some(x=>x.id===part.id))db.parts.push(structuredClone(part)); } db.seedUpdatesApplied.push('batch-v6'); try{localStorage.setItem(KEY,JSON.stringify(db))}catch{} }
if(!db.seedUpdatesApplied.includes('batch-v7')){for(const p of SEED_PARTS.filter(p=>p.id.startsWith('seed-batch-v7-'))){if(!db.parts.some(x=>x.id===p.id))db.parts.push(structuredClone(p))}db.seedUpdatesApplied.push('batch-v7');try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}}
let liveFeed=null,liveError='',current=null, modalSave=null, fileCallback=null, confirmKey='',confirmUntil=0;const money=n=>Number.isFinite(+n)?'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';const num=v=>Math.max(0,Number(v)||0);const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store=()=>{partIndex=null;try{localStorage.setItem(KEY,JSON.stringify(db))}catch{flash('Local save failed. Export a backup.')}};
const flash=s=>{let x=$('#message');x.textContent=s;x.hidden=false;clearTimeout(flash.timer);flash.timer=setTimeout(()=>x.hidden=true,6000)};
const feedCars=()=>liveFeed?Object.values(liveFeed.yards||{}).flatMap(y=>y.vehicles||[]):[];
const allCars=()=>[...MORE_DEMOS,...feedCars(),...db.cars].filter(c=>!db.hidden.includes(c.id));
const cleanModel=m=>String(m||'').toLowerCase().replace(/\b(super duty|sd|sedan|coupe|classic)\b/g,'').replace(/[^a-z0-9]/g,'');
const similarModel=(a,b)=>{let x=cleanModel(a),y=cleanModel(b);return x===y||(['f250','f350','mazda6','ram1500','silverado1500'].includes(x)&&y.startsWith(x))};
async function loadLiveInventory(){
  // Local file:// pages cannot reliably fetch adjacent JSON; show the bundled snapshot.
  const bundled=window.PULL_LIST_BUNDLED_YARDS;
  if(location.protocol==='file:'){
    liveFeed=bundled||null;
    liveError=bundled?'Opened from your computer: showing a bundled PARTIAL snapshot from '+(bundled.generatedAt||'unknown')+'. Daily updates require web hosting.':'Bundled feed missing; unzip the complete website folder.';
    renderBrowse(); return;
  }
  try{
    const response=await fetch('yard-inventory.json?ts='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status);
    const data=await response.json();
    if(data.format!=='pull-list-yard-feed-v1'||!data.yards)throw Error('Invalid inventory feed');
    liveFeed=data;liveError='';
  }catch(e){
    liveFeed=bundled||null;
    liveError=bundled?'Could not update feed ('+e.message+'). Showing bundled PARTIAL snapshot; NOT current complete inventory.':'Inventory feed unavailable: '+e.message;
  }
  renderBrowse();
}

const match=(p,c)=>String(p.make).trim().toLowerCase()===String(c.make).trim().toLowerCase()&&similarModel(p.model,c.model)&&+c.year>=+p.startYear&&+c.year<=+p.endYear;

let partIndex = null;

function getPartIndex() {
  if (
    partIndex &&
    partIndex.source === db.parts &&
    partIndex.size === db.parts.length
  ) return partIndex.map;

  const map = new Map();

  for (const p of db.parts) {
    const key =
      String(p.make).trim().toLowerCase() +
      '|' + cleanModel(p.model);

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }

  partIndex = {
    source: db.parts,
    size: db.parts.length,
    map
  };

  return map;
}

const carParts = c => {
  const index = getPartIndex();
  const make = String(c.make).trim().toLowerCase();
  const model = cleanModel(c.model);

  const candidates = [
    ...(index.get(make + '|' + model) || [])
  ];

  for (const prefix of [
    'f250', 'f350', 'mazda6',
    'ram1500', 'silverado1500'
  ]) {
    if (model !== prefix && model.startsWith(prefix)) {
      candidates.push(
        ...(index.get(make + '|' + prefix) || [])
      );
    }
  }

  return candidates.filter(p => match(p, c));
};

const profit=p=>num(p.salePrice)*(1-db.fee/100)-num(p.yardCost)-num(p.shipping)-num(db.other);
const photoUrl=c=>{try{let u=new URL(c.imageUrl);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
const availableLabel=c=>{if(!c.availableDate)return '';let d=new Date(c.availableDate+'T12:00:00');return Number.isFinite(d.getTime())?d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):c.availableDate};
const maxProfit=c=>{let parts=carParts(c).filter(p=>p.group==='general'&&num(p.soldCount)>=5);return parts.length?Math.max(...parts.map(profit)):null};
const save=()=>{store();render()};
function nav(screen){$$('.screen').forEach(e=>e.hidden=e.id!==screen);$$('nav button[data-nav]').forEach(e=>e.classList.toggle('selected',e.dataset.nav===screen));if(screen==='browse')renderBrowse();if(screen==='database')renderDB();window.scrollTo({top:0,behavior:'instant'})}
function render(){   document.body.classList.toggle('dark',!!db.dark);   renderBrowse();   if(current) renderDetail();   if(!$('#database').hidden) renderDB(); }
function renderBrowse(){const yard=$('#yard').value,search=$('#search').value.toLowerCase().trim(),min=Number($('#yearMin').value)||0,max=Number($('#yearMax').value)||9999;let cars=allCars().filter(c=>(yard==='all'?c.yard!=='demo':c.yard===yard)&&c.year>=min&&c.year<=max&&[c.year,c.make,c.model,c.row,c.trim].join(' ').toLowerCase().includes(search));const sort=$('#sort').value;cars.sort((a,b)=>sort==='row'?(String(a.row??'').localeCompare(String(b.row??''),undefined,{numeric:true})||a.make.localeCompare(b.make)):sort==='year'?b.year-a.year:sort==='date-new'||sort==='date-old'?((a.availableDate&&b.availableDate)?(sort==='date-new'?b.availableDate.localeCompare(a.availableDate):a.availableDate.localeCompare(b.availableDate)):(a.availableDate?-1:b.availableDate?1:0)):sort==='name'?(a.make+' '+a.model).localeCompare(b.make+' '+b.model):((maxProfit(b)??-Infinity)-(maxProfit(a)??-Infinity)));
$('#vehicleCount').textContent='('+cars.length+')';$('#shownYard').textContent=yard==='all'?'All Illinois yards':YARDS[yard].name;
$('#vehicles').innerHTML=cars.length?cars.map(c=>`<div class="car ${c.demo?'demo-car':''}">${photoUrl(c)?`<img class="car-thumb" src="${safe(photoUrl(c))}" alt="${safe(c.year+' '+c.make+' '+c.model)} yard photo" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">`:''}<div class="car-main"><div class="name">${safe(c.year)} ${safe(c.make)} ${safe(c.model)}</div><small>${safe(c.demo?'Research':YARDS[c.yard]?.name)} · Row ${safe(c.row||'—')} ${c.space?'· Space '+safe(c.space):''} ${c.demo?'· RESEARCH':''}</small>${c.availableDate?`<small class="available-date">Available ${safe(availableLabel(c))}</small>`:''}<small>${carParts(c).length} recommended parts</small></div><div class="right"><div class="value">${maxProfit(c)===null?'—':money(maxProfit(c))}</div><small>Top est. net profit</small><button class="btn" data-open="${safe(c.id)}">View parts →</button></div></div>`).join(''):`<div class="empty">No verified vehicles are available for this yard yet. Check the inventory status above, or choose Research to explore your parts database.</div>`;
const keys=yard==='all'?['north','south','island','summit']:[yard];
if(yard==='demo')$('#inventoryStatus').textContent=MORE_DEMOS.length+' research vehicles loaded. These are NOT confirmed in any yard.';
else if(liveError)$('#inventoryStatus').textContent=liveError+' · '+keys.map(k=>{let y=liveFeed?.yards?.[k];return (YARDS[k]?.name||k)+': '+(y?.vehicles?.length||0)+' saved vehicles, '+(y?.status||'unavailable')}).join(' | ');
else if(!liveFeed)$('#inventoryStatus').textContent='Loading yard inventory feed…';
else $('#inventoryStatus').textContent=keys.map(k=>{const item=liveFeed.yards[k];if(!item)return YARDS[k].name+': not connected';const d=item.checkedAt?new Date(item.checkedAt).toLocaleString():'unknown';return YARDS[k].name+': '+(item.vehicles||[]).length+' vehicles; '+item.status+'; last checked '+d+' — '+(item.message||'')}).join(' | ');
$$('[data-open]').forEach(b=>b.onclick=()=>{current=allCars().find(c=>c.id===b.dataset.open);nav('detail');renderDetail()});}
function renderDetail(){if(!current)return;current=allCars().find(c=>c.id===current.id);if(!current){current=null;nav('browse');return}$('#carYard').textContent=(YARDS[current.yard]?.name||'Yard')+(current.demo?' · RESEARCH ONLY':' · YARD INVENTORY');$('#carTitle').textContent=`${current.year} ${current.make} ${current.model}`;$('#carMeta').textContent=[current.trim,current.body,current.engine,'Row '+(current.row||'—')].filter(Boolean).join(' · ');$('#carVin').textContent=current.vin?'VIN: '+current.vin:'VIN not entered';const p=photoUrl(current);$('#carPhoto').innerHTML=p?`<img src="${safe(p)}" alt="${safe(current.year+' '+current.make+' '+current.model)} yard photo" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.hidden=true">`:'';$('#carPhoto').hidden=!p;
const details=[['VIN',current.vin],['Generation',current.generation],['Trim',current.trim&&current.trim!=='Not confirmed'?current.trim:'Not confirmed'],['Body style',current.body],['Engine',current.engine],['Fuel',current.fuel],['Drivetrain',current.drivetrain],['Transmission',current.transmission],['Yard section',current.section],['Yard row',current.row],['Space',current.space],['Stock ID',current.stock],['Available in yard since',availableLabel(current)],['Inventory source',current.source]];$('#vehicleSpecs').innerHTML=details.map(([label,val])=>`<div class="spec-item"><small>${safe(label)}</small><strong>${safe(val || 'Not available')}</strong></div>`).join('');$('#topProfit').textContent=maxProfit(current)===null?'—':money(maxProfit(current));let parts=carParts(current);$('#partCount').textContent=parts.length;$('#removeCar').disabled=!!current.demo;
const labels={general:['Best general opportunities','At least five reported sold comparisons; verify current market prices.'],thin:['Thin evidence — verify before pulling','Fewer than five reported sold comparisons; these do not set vehicle ranking.'],fitment:['Must verify trim / equipment','Confirm required trim, transmission or equipment on the actual vehicle.']};$('#parts').innerHTML=Object.entries(labels).map(([g,[name,desc]])=>{let ps=parts.filter(p=>p.group===g).sort((a,b)=>profit(b)-profit(a));return `<section class="partgroup"><h2>${name} (${ps.length})</h2><p>${desc}</p>${ps.length?ps.map(p=>`<article class="part"><div class="parthead"><div><h3>${safe(p.name)}</h3><small>${safe(p.variant||p.condition||'')} ${p.variant&&p.condition?'· '+safe(p.condition):''}</small><span class="tag">${safe(p.pullTime||'moderate')} pull</span><span class="tag">${safe(p.startYear)}–${safe(p.endYear)}</span>${g!=='general'?`<span class="tag warn">${g==='thin'?'Thin evidence':'Verify fitment'}</span>`:''}${g==='fitment'&&num(p.soldCount)<5?'<span class="tag warn">Thin evidence</span>':''}</div><div class="profit">${money(profit(p))}<small>Est. net profit</small></div></div><div class="metrics"><div class="metric"><small>Est. sale price</small><b>${money(p.salePrice)}</b></div><div class="metric"><small>Yard cost</small><b>${money(p.yardCost)}</b></div><div class="metric"><small>Shipping</small><b>${money(p.shipping)}</b></div><div class="metric"><small>Sold comps*</small><b>${safe(p.soldCount??'—')}</b></div></div><small>*Reported by imported source, not live verified · Fee ${db.fee}%${p.notes?' · '+safe(p.notes):''}</small><div class="buttonrow"><button class="btn primary" data-ebay="${safe(p.id)}">eBay sold ↗</button><button class="btn" data-editpart="${safe(p.id)}">Edit price / part</button><button class="btn danger" data-deletepart="${safe(p.id)}">Remove ×2</button></div></article>`).join(''):'<div class="empty">No matching parts</div>'}</section>`}).join('');wireParts();}
    
function soldUrl(p,c){
  const raw = p.searchTitle ||
    [c.year,c.make,c.model,p.name].join(' ');

  const q = String(raw)
    .replace(/\s*\(\s*For\s*:\s*[^)]*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return 'https://www.ebay.com/sch/i.html?_nkw=' +
    encodeURIComponent(q) +
    '&LH_Sold=1&LH_Complete=1';
}

function wireParts(){$$('[data-ebay]').forEach(b=>b.onclick=()=>{const p=db.parts.find(p=>p.id===b.dataset.ebay);window.open(soldUrl(p,current),'_blank','noopener,noreferrer')});$$('[data-editpart]').forEach(b=>b.onclick=()=>openPart(db.parts.find(p=>p.id===b.dataset.editpart)));$$('[data-deletepart]').forEach(b=>b.onclick=()=>twice('part-'+b.dataset.deletepart,()=>{db.parts=db.parts.filter(p=>p.id!==b.dataset.deletepart);save();flash('Part removed from all matching vehicles.')}));}
function twice(key,action){if(confirmKey===key&&Date.now()<confirmUntil){confirmKey='';action()}else{confirmKey=key;confirmUntil=Date.now()+5000;flash('Tap the same Remove button again within 5 seconds to confirm.')}}
function renderDB(){let q=$('#dbsearch').value.toLowerCase();let ps=db.parts.filter(p=>(p.make+' '+p.model+' '+p.name+' '+p.variant).toLowerCase().includes(q));$('#dblist').innerHTML=ps.map(p=>`<div class="dbrow"><div><b>${safe(p.name)}</b><small style="display:block;color:var(--muted)">${safe(p.make)} ${safe(p.model)} · ${safe(p.startYear)}–${safe(p.endYear)} · ${money(p.salePrice)}</small></div><div class="buttonrow"><button class="btn" data-dbedit="${safe(p.id)}">Edit</button><button class="btn danger" data-dbremove="${safe(p.id)}">×2</button></div></div>`).join('')||'<p class="muted">No parts found.</p>';$$('[data-dbedit]').forEach(b=>b.onclick=()=>openPart(db.parts.find(p=>p.id===b.dataset.dbedit)));$$('[data-dbremove]').forEach(b=>b.onclick=()=>twice('part-'+b.dataset.dbremove,()=>{db.parts=db.parts.filter(p=>p.id!==b.dataset.dbremove);save();flash('Part removed.')}));}
function modal(title,fields,handler){$('#modalTitle').textContent=title;$('#fields').innerHTML=fields;modalSave=handler;$('#modal').showModal();$('#fields input:not([type=checkbox]),#fields select').at(0)?.focus()}
const field=(label,key,value='',type='text',extra='')=>`<label>${label}<input name="${key}" type="${type}" value="${safe(value)}" ${extra}></label>`;
const selected=(items,val)=>items.map(x=>`<option value="${safe(x[0])}" ${x[0]===val?'selected':''}>${safe(x[1])}</option>`).join('');
function openCar(c){let yard=c?.yard||($('#yard').value==='all'||$('#yard').value==='demo'?'north':$('#yard').value);modal(c?'Edit vehicle':'Add vehicle',`${field('Year','year',c?.year||'', 'number','required min="1900" max="2100"')}${field('Make','make',c?.make||'', 'text','required')}${field('Model','model',c?.model||'', 'text','required')}<label>Yard<select name="yard">${selected(Object.entries(YARDS).filter(([k])=>k!=='demo').map(([k,v])=>[k,v.name]),yard)}</select></label>${field('Row','row',c?.row||'')}${field('Trim','trim',c?.trim||'')}${field('VIN (optional)','vin',c?.vin||'')}${field('Engine (optional)','engine',c?.engine||'')}${field('Body style','body',c?.body||'')}`,v=>{const obj={id:c?.id||crypto.randomUUID(),year:+v.year,make:v.make.trim(),model:v.model.trim(),yard:v.yard,row:v.row,trim:v.trim,vin:v.vin.toUpperCase(),engine:v.engine,body:v.body};if(c){Object.assign(c,obj);current=obj}else{db.cars.push(obj)}save();flash('Vehicle saved on this device.')});}
function openPart(p){const base=p||{make:current?.make||'Mazda',model:current?.model||'Mazda6',startYear:current?.year||2016,endYear:current?.year||2016,name:'',variant:'',condition:'',group:'general',salePrice:'',yardCost:'',shipping:0,soldCount:0,pullTime:'moderate',notes:'',searchTitle:''};modal(p?'Edit price / part':'Add recommended part',`${field('Make','make',base.make,'text','required')}${field('Model','model',base.model,'text','required')}<div class="side">${field('Start year','startYear',base.startYear,'number','required')}${field('End year','endYear',base.endYear,'number','required')}</div>${field('Part name','name',base.name,'text','required')}${field('Trim / variant','variant',base.variant)}${field('Fitment notes','condition',base.condition)}<label>Section<select name="group">${selected([['general','General opportunities'],['thin','Thin evidence'],['fitment','Verify trim / equipment']],base.group)}</select></label><div class="side">${field('Estimated eBay item selling price ($)','salePrice',base.salePrice,'number','step="0.01" min="0" required')}${field('Yard cost ($)','yardCost',base.yardCost,'number','step="0.01" min="0" required')}</div><div class="side">${field('Shipping cost ($)','shipping',base.shipping,'number','step="0.01" min="0"')}${field('Sold comparisons','soldCount',base.soldCount,'number','min="0"')}</div><label>Pull time<select name="pullTime">${selected([['quick','Quick'],['moderate','Moderate'],['heavy','Heavy']],base.pullTime)}</select></label>${field('eBay sold search title','searchTitle',base.searchTitle)}<label>Notes<textarea name="notes">${safe(base.notes)}</textarea></label><p class="hint">Estimated profit = item sale price − yard cost − shipping − fees (${db.fee}%) − other costs. Changes affect every vehicle matching the entered year range.</p>`,v=>{if(+v.endYear<+v.startYear){flash('End year must be at least start year.');return false}const result={...base,id:p?.id||crypto.randomUUID(),make:v.make.trim(),model:v.model.trim(),startYear:+v.startYear,endYear:+v.endYear,name:v.name.trim(),variant:v.variant,condition:v.condition,group:v.group,salePrice:num(v.salePrice),yardCost:num(v.yardCost),shipping:num(v.shipping),soldCount:num(v.soldCount),pullTime:v.pullTime,notes:v.notes,searchTitle:v.searchTitle,edited:true};if(p)Object.assign(p,result);else db.parts.push(result);save();flash('Part saved on this device.')})}
function openSettings(){modal('Settings & data',`<p class="hint">All edits and manually imported vehicle lists are stored in this browser using local storage. They are not synchronized across phones or backed up online. Export backups regularly.</p>${field('Estimated eBay fee (%)','fee',db.fee,'number','step="0.01" min="0" max="99"')}${field('Other per-part costs ($)','other',db.other,'number','step="0.01" min="0"')}<p class="hint">Current yard inventory is not automatically fetched. Import a CSV or visit the official yard website. No user account or backend is connected.</p>`,v=>{db.fee=num(v.fee);db.other=num(v.other);save()})}
function csvParse(src){const rows=[];let row=[],v='',quoted=false;for(let i=0;i<src.length;i++){let c=src[i];if(c==='"'){if(quoted&&src[i+1]==='"'){v+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(v);v=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&src[i+1]==='\n')i++;row.push(v);if(row.some(x=>x.trim()))rows.push(row);row=[];v=''}else v+=c}row.push(v);if(row.some(x=>x.trim()))rows.push(row);let hdr=rows.shift().map(x=>x.trim().toLowerCase().replace(/[^a-z0-9]/g,''));return rows.map(r=>Object.fromEntries(hdr.map((h,i)=>[h,r[i]||''])))}
function chooseFile(accept,callback){let f=$('#file');f.accept=accept;fileCallback=callback;f.value='';f.click()}
$('#file').onchange=async e=>{let f=e.target.files?.[0];if(!f)return;try{await fileCallback(await f.text())}catch(err){flash('Could not import: '+err.message)}};
function importVehicles(text){const rows=csvParse(text);let count=0;const allowed=Object.keys(YARDS).filter(k=>k!=='demo');for(const r of rows){let year=Number(r.year),make=r.make,model=r.model;let yard=(r.yard||$('#yard').value||'').toLowerCase();yard=allowed.find(k=>k===yard||YARDS[k].name.toLowerCase()===yard)||($('#yard').value!=='all'&&$('#yard').value!=='demo'?$('#yard').value:null);if(!year||!make||!model||!yard)continue;db.cars.push({id:crypto.randomUUID(),yard,year,make,model,row:r.row||'',vin:r.vin||'',trim:r.trim||'',engine:r.engine||'',body:r.body||''});count++}save();flash(`Imported ${count} vehicles. CSV columns: yard,year,make,model,row,vin,trim,engine,body.`)}
function importParts(text){let d=JSON.parse(text);if(d.format==='pull-list-batch-v1'&&Array.isArray(d.vehicles)){let before=db.parts.length;for(const vehicle of d.vehicles){importSingleParts(vehicle,false)}save();flash(`Imported ${db.parts.length-before} new recommendations from ${d.vehicles.length} vehicle records.`);return;}importSingleParts(d,true)}
function importSingleParts(d,notify){let a=Array.isArray(d)?d:[...(d.generalRecommendations||[]),...(d.verifyFitmentRecommendations||[])];if(!Array.isArray(a))throw Error('Expected JSON array or recommendations object.');let n=0;for(let i=0;i<a.length;i++){const x=a[i];if(!x.partFamily&&!x.name)continue;let year=Number(d.query?.year)||2016,make=d.query?.make||x.make,model=d.query?.model||x.model;if(!make||!model)throw Error('Include vehicle query.make/model or use existing parts JSON format');let group=x.group||(d.verifyFitmentRecommendations?.includes(x)?'fitment':(num(x.soldCount)<5?'thin':'general'));if(db.parts.some(p=>p.make.toLowerCase()===String(make).toLowerCase()&&p.model.replace(/\W/g,'').toLowerCase()===String(model).replace(/\W/g,'').toLowerCase()&&p.name===(x.partFamily||x.name)&&p.searchTitle===(x.soldSearchTitle||x.searchTitle||'')))continue;db.parts.push({id:crypto.randomUUID(),make,model,startYear:x.generationStartYear||x.startYear||year,endYear:x.generationEndYear||x.endYear||year,name:x.partFamily||x.name,variant:x.variantLabel||x.variant||'',condition:'',group,salePrice:x.medianSalePrice??x.salePrice??0,saleTotal:x.medianTotalPrice??0,yardCost:x.yardPrice??x.yardCost??0,shipping:x.medianShipping??x.shipping??0,soldCount:x.soldCount??0,originalMargin:x.estimatedNetMargin,searchTitle:x.soldSearchTitle||x.searchTitle||'',pullTime:x.pullTime||'moderate',notes:x.notes||'',source:'Imported recommendations, unverified',edited:false});n++}if(notify){save();flash(`Imported ${n} recommendations. Review duplicates and eBay prices.`)}}
function exportBackup(){let blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pull-list-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function restoreBackup(text){const data=JSON.parse(text);if(!Array.isArray(data.parts)||!Array.isArray(data.cars))throw Error('Not a Pull List backup');db=data;db.hidden??=[];db.fee??=13.25;db.other??=0;current=null;save();nav('browse');flash('Backup restored.')}
async function vinDecode(){if(!current?.vin){flash('Edit this car to enter its VIN first.');return}try{let r=await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/'+encodeURIComponent(current.vin)+'?format=json');if(!r.ok)throw Error('Lookup unavailable');let v=(await r.json()).Results?.[0];if(!v)throw Error('No decoded record');let detail=[v.ModelYear,v.Make,v.Model,v.Trim,v.BodyClass,v.EngineModel,v.DisplacementL&&v.DisplacementL+'L'].filter(Boolean).join(' · ');flash('NHTSA VIN decode: '+detail+'. Confirm trim and options physically; VIN data may be incomplete.')}catch(e){flash('VIN lookup failed: '+e.message+'. Check connection.')}}


/* =====================================================
   PULL LIST — MOBILE PAGINATION UPDATE
   Compatible with the existing Pull List app.js

   Features:
   - 50, 100, or 200 cars per page
   - Full-inventory search
   - Newest arrivals first
   - Automatic page reset when filters change
   - Saved page-size preference
   - Lazy-loading car photos
   - Pull List logo when photos are missing
   - Preserves existing parts and research
   ===================================================== */

(() => {
  'use strict';

  const PAGE_STORAGE_KEY = 'pulllist-pagination-v2';

  const allowedSizes = [50, 100, 200];

  let savedSize = 50;

  try {
    const stored = JSON.parse(
      localStorage.getItem(PAGE_STORAGE_KEY) || '{}'
    );

    if (allowedSizes.includes(Number(stored.pageSize))) {
      savedSize = Number(stored.pageSize);
    }
  } catch (error) {
    console.warn('[Pull List] Page settings unavailable.');
  }

  let pageSize = savedSize;
  let currentPage = 1;
  let lastFilters = '';

  const sizeSelect = document.getElementById('pageSize');
  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');
  const pageIndicator = document.getElementById('pageIndicator');
  const pageSummary = document.getElementById('pageSummary');

  if (
    !sizeSelect ||
    !prevButton ||
    !nextButton ||
    !pageIndicator ||
    !pageSummary
  ) {
    console.error(
      '[Pull List] Pagination controls were not found. ' +
      'Update index.html first.'
    );
    return;
  }

  sizeSelect.value = String(pageSize);

  // Newest arrivals are the default.
  const sortSelect = document.getElementById('sort');
  sortSelect.value = 'date-new';

  function rememberPageSize() {
    try {
      localStorage.setItem(
        PAGE_STORAGE_KEY,
        JSON.stringify({ pageSize })
      );
    } catch (error) {
      console.warn(
        '[Pull List] Could not save page-size preference.'
      );
    }
  }

  function sortCars(cars, sort) {
    const text = value => String(value ?? '');

    if (sort === 'date-new' || sort === 'date-old') {
      const newest = sort === 'date-new';

      cars.sort((a, b) => {
        const dateA = text(
          a.availableDate || a.setDate || a.arrivalDate
        );

        const dateB = text(
          b.availableDate || b.setDate || b.arrivalDate
        );

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return newest
          ? dateB.localeCompare(dateA)
          : dateA.localeCompare(dateB);
      });
    }


else if (sort === 'profit') {
  const profitCache = new Map();

  const value = car => {
    const key =
      String(car.make).toLowerCase() + '|' +
      cleanModel(car.model) + '|' +
      car.year;

    if (!profitCache.has(key)) {
      profitCache.set(key, maxProfit(car));
    }

    return profitCache.get(key);
  };

  cars.sort((a, b) => {
    const pa = value(a);
    const pb = value(b);

    if (pa === null && pb === null) return 0;
    if (pa === null) return 1;
    if (pb === null) return -1;

    return pb - pa;
  });
}

else if (sort === 'year') {
  cars.sort((a, b) =>
    Number(b.year) - Number(a.year)
  );
}

else if (sort === 'name') {
  cars.sort((a, b) =>
    (String(a.make) + ' ' + String(a.model))
      .localeCompare(
        String(b.make) + ' ' + String(b.model),
        undefined,
        { numeric: true, sensitivity: 'base' }
      )
  );
}

    else if (sort === 'row') {
      cars.sort((a, b) =>
        text(a.row).localeCompare(
          text(b.row),
          undefined,
          { numeric: true }
        )
      );
    }

    return cars;
  }

  function imageForCar(car) {
    const photo = photoUrl(car);

    if (!photo) {
      return `
        <img
          class="car-thumb fallback-logo"
          src="pull-list-logo.png"
          alt="Pull List"
          loading="lazy"
          decoding="async"
        >
      `;
    }

    return `
      <img
        class="car-thumb"
        src="${safe(photo)}"
        alt="${safe(
          car.year + ' ' + car.make + ' ' + car.model
        )}"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        onerror="
          this.onerror=null;
          this.src='pull-list-logo.png';
          this.classList.add('fallback-logo');
        "
      >
    `;
  }

  function vehicleCard(car) {
    const parts = carParts(car);
    const best = maxProfit(car);

    const yardName = car.demo
      ? 'Research'
      : YARDS[car.yard]?.name || car.yard;

    const arrival = car.availableDate
      ? `
        <small class="available-date">
          Available ${safe(availableLabel(car))}
        </small>
      `
      : '';

    return `
      <div class="car ${car.demo ? 'demo-car' : ''}">

        ${imageForCar(car)}

        <div class="car-main">

          <div class="name">
            ${safe(car.year)}
            ${safe(car.make)}
            ${safe(car.model)}
          </div>

          <small>
            ${safe(yardName)}
            · Row ${safe(car.row || '—')}
            ${
              car.space
                ? ' · Space ' + safe(car.space)
                : ''
            }
          </small>

          ${arrival}

          <small>
            ${parts.length} recommended parts
          </small>

        </div>

        <div class="right">

          <div class="value">
            ${best === null ? '—' : money(best)}
          </div>

          <small>
            Top est. net profit
          </small>

          <button
            type="button"
            class="btn"
            data-open="${safe(car.id)}"
          >
            View parts →
          </button>

        </div>

      </div>
    `;
  }

  function updateInventoryStatus(yard) {
    const status = document.getElementById(
      'inventoryStatus'
    );

    if (yard === 'demo') {
      status.textContent =
        MORE_DEMOS.length +
        ' research vehicles loaded. ' +
        'These are not confirmed in any yard.';

      return;
    }

    if (liveError) {
      status.textContent = liveError;
      return;
    }

    if (!liveFeed) {
      status.textContent = 'Loading yard inventory feed…';
      return;
    }

    const keys = yard === 'all'
      ? ['north', 'south', 'island', 'summit']
      : [yard];

    status.textContent = keys.map(key => {
      const item = liveFeed.yards?.[key];
      const name = YARDS[key]?.name || key;

      if (!item) {
        return name + ': no inventory loaded';
      }

      const count = item.vehicles?.length || 0;
      const state = item.status || 'unknown';

      return `${name}: ${count} vehicles; ${state}`;
    }).join(' | ');
  }

  // Replace the old browse renderer with the
  // paginated version. All other app functions remain.
  renderBrowse = function () {
    const yard = $('#yard').value;
    const search = $('#search').value
      .toLowerCase()
      .trim();

    const yearMin =
      Number($('#yearMin').value) || 0;

    const yearMax =
      Number($('#yearMax').value) || 9999;

    const sort = $('#sort').value;

    const filterKey = JSON.stringify({
      yard,
      search,
      yearMin,
      yearMax,
      sort
    });

    // Changing filters automatically returns to page 1.
    if (filterKey !== lastFilters) {
      currentPage = 1;
      lastFilters = filterKey;
    }

    // Search across ALL vehicles before pagination.
    const matching = allCars().filter(car => {
      if (yard === 'all') {
        if (car.yard === 'demo') return false;
      } else if (car.yard !== yard) {
        return false;
      }

      if (
        car.year < yearMin ||
        car.year > yearMax
      ) {
        return false;
      }

      const vehicleText = [
        car.year,
        car.make,
        car.model,
        car.trim,
        car.row,
        car.space,
        car.vin,
        car.stock,
        car.engine,
        car.body
      ].join(' ').toLowerCase();

      return vehicleText.includes(search);
    });

    sortCars(matching, sort);

    const totalCars = matching.length;

    const totalPages = Math.max(
      1,
      Math.ceil(totalCars / pageSize)
    );

    currentPage = Math.min(
      Math.max(1, currentPage),
      totalPages
    );

    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex = Math.min(
      startIndex + pageSize,
      totalCars
    );

    // The important optimization:
    // Render only the current page.
    const visibleCars = matching.slice(
      startIndex,
      endIndex
    );

    $('#vehicleCount').textContent =
      `(${totalCars})`;

    $('#shownYard').textContent =
      yard === 'all'
        ? 'All Illinois yards'
        : YARDS[yard]?.name || yard;

    pageSummary.textContent = totalCars
      ? `Showing ${startIndex + 1}–${endIndex} of ${totalCars}`
      : 'Showing 0 vehicles';

    pageIndicator.textContent =
      `Page ${currentPage} of ${totalPages}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;

    $('#vehicles').innerHTML =
      visibleCars.length
        ? visibleCars.map(vehicleCard).join('')
        : `
          <div class="empty">
            No vehicles match your search.
          </div>
        `;

    updateInventoryStatus(yard);

    // Keep the View Parts buttons working.
    document.querySelectorAll(
      '#vehicles [data-open]'
    ).forEach(button => {
      button.onclick = () => {
        const id = button.dataset.open;

        current = allCars().find(
          car => String(car.id) === id
        );

        if (!current) {
          console.warn(
            '[Pull List] Vehicle no longer available.'
          );
          return;
        }

        nav('detail');
        renderDetail();
      };
    });
  };

  // Page-size selector.
  sizeSelect.onchange = () => {
    const requestedSize = Number(sizeSelect.value);

    pageSize = allowedSizes.includes(requestedSize)
      ? requestedSize
      : 50;

    currentPage = 1;
    rememberPageSize();
    renderBrowse();
  };

  // Previous page.
  prevButton.onclick = () => {
    if (currentPage <= 1) return;

    currentPage--;
    renderBrowse();

    document.querySelector('.sectionheading')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  };

  // Next page.
  nextButton.onclick = () => {
    const currentTotal = Number(
      pageIndicator.textContent
        .split(' of ')[1]
    ) || 1;

    if (currentPage >= currentTotal) return;

    currentPage++;
    renderBrowse();

    document.querySelector('.sectionheading')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  };

  console.log(
    '[Pull List] Mobile pagination loaded.',
    `Page size: ${pageSize}`
  );
})();


/* Initialize Pull List application */

$('#form').onsubmit = e => {
  e.preventDefault();
  const vals = Object.fromEntries(new FormData(e.currentTarget));
  if (modalSave?.(vals) === false) return;
  $('#modal').close();
};

$('#close').onclick =
$('#cancel').onclick = () => $('#modal').close();

$('#theme').onclick = () => {
  db.dark = !db.dark;
  save();
};

$('#settings').onclick =
$('#navSettings').onclick = openSettings;

$$('nav [data-nav]').forEach(b => {
  b.onclick = () => nav(b.dataset.nav);
});

$('#yard').onchange = renderBrowse;
$('#search').oninput = renderBrowse;
$('#sort').onchange = renderBrowse;
$('#yearMin').oninput = renderBrowse;
$('#yearMax').oninput = renderBrowse;

$('#back').onclick =
$('#dbback').onclick = () => nav('browse');

$('#addcar').onclick = () => openCar();

$('#editcar').onclick = () => {
  if (current?.demo) {
    flash('Research vehicles are read-only.');
    return;
  }
  openCar(current);
};

$('#removeCar').onclick = () => {
  if (current?.demo) return;

  twice('car-' + current.id, () => {
    db.hidden.push(current.id);
    save();
    current = null;
    nav('browse');
    flash('Vehicle hidden.');
  });
};

$('#newpart').onclick =
$('#dbadd').onclick = () => openPart();

$('#vinLookup').onclick = vinDecode;

$('#openyard').onclick = () => {
  const y = YARDS[$('#yard').value];

  if (y?.url) {
    window.open(y.url, '_blank', 'noopener,noreferrer');
  } else {
    flash('Select a yard to open its official inventory.');
  }
};

$('#importvehicles').onclick = () =>
  chooseFile('.csv', importVehicles);

$('#importparts').onclick = () =>
  chooseFile('.json,.txt', importParts);

$('#exportdata').onclick = exportBackup;

$('#importbackup').onclick = () =>
  chooseFile('.json', restoreBackup);

$('#dbsearch').oninput = renderDB;

// Apply initial appearance and display the homepage.
render();
nav('browse');

// Load the live inventory.
loadLiveInventory();

// Automatically import newly added research.
(async () => {
  try {
    const response = await fetch(
      './seed.json?sync=' + Date.now(),
      { cache: 'no-store' }
    );

    if (!response.ok) return;

    const latest = await response.json();
    if (!Array.isArray(latest)) return;

    const existing = new Set(
      db.parts.map(p => String(p.id))
    );

    let added = 0;

    for (const part of latest) {
      const id = String(part?.id || '');

      if (!id || existing.has(id)) continue;

      db.parts.push(part);
      existing.add(id);
      added++;
    }

    if (added > 0) {
      store();
      renderBrowse();

      console.log(
        '[Pull List] Automatically imported',
        added,
        'new recommendations.'
      );
    }
  } catch (error) {
    console.warn(
      '[Pull List] Research sync unavailable:',
      error
    );
  }
})();



/* ============================================
   PULL LIST — VEHICLE DETAILS UPGRADE
   Research-based generation matching
   Compact vehicle information and part cards
   ============================================ */

(() => {
  'use strict';

  // Normalize names for matching research vehicles.
  const normalize = value =>
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  function findGeneration(vehicle) {
    if (vehicle.generation) {
      return vehicle.generation;
    }

    const year = Number(vehicle.year);

    // Search existing researched vehicles.
    const matches = MORE_DEMOS.filter(research => {
      if (
        normalize(research.make) !==
        normalize(vehicle.make)
      ) return false;

      if (
        normalize(research.model) !==
        normalize(vehicle.model)
      ) return false;

      const generation = String(
        research.generation || ''
      );

      const years = generation.match(
        /\((\d{4})\s*[–-]\s*(\d{4})\)/
      );

      // Only match when research explicitly
      // states a generation year range.
      if (!years) return false;

      const start = Number(years[1]);
      const end = Number(years[2]);

      return year >= start && year <= end;
    });

    // Avoid choosing between conflicting matches.
    const generations = [
      ...new Set(
        matches.map(car => car.generation)
      )
    ];

    return generations.length === 1
      ? generations[0]
      : '';
  }

  const originalRenderDetail = renderDetail;

  renderDetail = function () {
    if (!current) return;

    const generation = findGeneration(current);
    const inferred = !current.generation && !!generation;

    // Add session-only generation information.
    // Does not change saved or downloaded inventory.
    if (inferred) {
      current.generation = generation;
    }

    // Preserve existing parts, pricing and buttons.
    originalRenderDetail();

    if (!current) return;

    const detail = document.getElementById('detail');
    const specs = document.getElementById('vehicleSpecs');
    const hero = detail?.querySelector('.carhero');

    if (!detail || !specs || !hero) return;

    detail.classList.add('pl-compact-details');

    detail.querySelector('.pl-vehicle-chips')?.remove();
    detail.querySelector('.pl-spec-toggle')?.remove();

    const values = [
      generation && {
        label: 'Generation',
        value: generation
      },
      current.body && {
        label: 'Body',
        value: current.body
      },
      current.engine && {
        label: 'Engine',
        value: current.engine
      },
      current.row && {
        label: 'Row',
        value: current.row
      },
      current.space && {
        label: 'Space',
        value: current.space
      },
      current.availableDate && {
        label: 'Added',
        value: availableLabel(current)
      },
      current.vin && {
        label: 'VIN',
        value: current.vin
      }
    ].filter(Boolean);

    const chips = document.createElement('div');
    chips.className = 'pl-vehicle-chips';

    chips.innerHTML = values.map(item => `
      <span class="pl-chip">
        <strong>${safe(item.label)}</strong>
        ${safe(item.value)}
      </span>
    `).join('');

    specs.before(chips);

    if (inferred) {
      const note = document.createElement('small');
      note.className = 'pl-generation-note';
      note.textContent =
        'Generation inferred from matching research. ' +
        'Verify engine, trim, and equipment before pulling parts.';
      chips.after(note);
    }

    // Hide the large specifications grid initially,
    // but allow it to be expanded at any time.
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'btn pl-spec-toggle';
    toggle.textContent = 'Show all vehicle specifications ↓';

    specs.hidden = true;

    toggle.onclick = () => {
      specs.hidden = !specs.hidden;

      toggle.textContent = specs.hidden
        ? 'Show all vehicle specifications ↓'
        : 'Hide vehicle specifications ↑';
    };

    specs.before(toggle);
  };

  // Style the compact details and profit cards.
  const style = document.createElement('style');
  style.textContent = `
    .pl-compact-details .carhero {
      padding: 19px;
    }

    .pl-compact-details .carhero h1 {
      font-size: clamp(23px, 4vw, 32px);
      margin: 7px 0;
    }

    .pl-compact-details #carMeta,
    .pl-compact-details #carVin {
      font-size: 12px;
      color: var(--muted);
    }

    .pl-vehicle-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin: 13px 0 8px;
    }

    .pl-chip {
      display: inline-flex;
      gap: 5px;
      align-items: center;
      background: var(--chip);
      color: var(--ink);
      border: 1px solid var(--line);
      padding: 7px 10px;
      border-radius: 20px;
      font-size: 11px;
      line-height: 1.4;
      max-width: 100%;
      overflow-wrap: anywhere;
    }

    .pl-chip strong {
      color: var(--accent);
      font-weight: 800;
    }

    .pl-generation-note {
      display: block;
      color: var(--muted);
      font-size: 11px;
      margin: 5px 0 12px;
    }

    .pl-spec-toggle {
      margin: 9px 0 14px;
    }

    .pl-compact-details #vehicleSpecs[hidden] {
      display: none !important;
    }

    .pl-compact-details .summarygrid {
      margin: 12px 0 20px;
    }

    .pl-compact-details .partgroup {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin: 23px 0;
    }

    .pl-compact-details .partgroup > h2,
    .pl-compact-details .partgroup > p,
    .pl-compact-details .partgroup > .empty {
      grid-column: 1 / -1;
    }

    .pl-compact-details .partgroup > p {
      margin: -3px 0 4px;
    }

    .pl-compact-details .part {
      margin: 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pl-compact-details .parthead {
      display: block;
    }

    .pl-compact-details .part h3 {
      font-size: 17px;
      line-height: 1.35;
    }

    .pl-compact-details .part .profit {
      text-align: left;
      margin-top: 10px;
      font-size: 25px;
    }

    .pl-compact-details .part .metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      margin: 8px 0;
    }

    .pl-compact-details .part .metric {
      min-width: 0;
    }

    .pl-compact-details .part .buttonrow {
      margin-top: auto;
    }

    .pl-compact-details .part .buttonrow .btn {
      flex: 1;
    }

    @media (max-width: 850px) {
      .pl-compact-details .partgroup {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 590px) {
      .pl-compact-details .partgroup {
        grid-template-columns: 1fr;
      }

      .pl-compact-details .part {
        padding: 15px;
      }

      .pl-compact-details .part .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .pl-compact-details .carhero {
        padding: 14px;
      }
    }
  `;

  document.head.appendChild(style);

  console.log(
    '[Pull List] Compact vehicle details enabled.'
  );
})();


/* Pull List — Generation labels from research data */

(() => {
  const normalize = s =>
    String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  function getGeneration(car) {
    if (car.generation) return car.generation;

    const year = Number(car.year);
    const sameCar = p =>
      normalize(p.make) === normalize(car.make) &&
      normalize(p.model) === normalize(car.model);

    // Find generation ranges saved in seed.json.
    const ranges = db.parts
      .filter(sameCar)
      .filter(p =>
        Number(p.generationStartYear) <= year &&
        Number(p.generationEndYear) >= year
      )
      .map(p => [
        Number(p.generationStartYear),
        Number(p.generationEndYear)
      ]);

    if (!ranges.length) return "";

    // Avoid displaying conflicting generation ranges.
    const unique = [...new Set(ranges.map(r => r.join("-")))];

    if (unique.length !== 1) return "";

    const [start, end] = ranges[0];

    // Try to find an existing generation name.
    const researched = MORE_DEMOS.find(r =>
      sameCar(r) &&
      r.generation &&
      r.generation.includes(String(start)) &&
      r.generation.includes(String(end))
    );

    return researched?.generation ||
      `Generation (${start}–${end})`;
  }

  const previousRenderDetail = renderDetail;

  renderDetail = function () {
    previousRenderDetail();

    if (!current) return;

    const generation = getGeneration(current);
    if (!generation) return;

    // Update the existing specifications panel.
    document.querySelectorAll(
      "#vehicleSpecs .spec-item"
    ).forEach(item => {
      const label = item.querySelector("small");
      const value = item.querySelector("strong");

      if (
        label?.textContent.trim() === "Generation" &&
        value
      ) {
        value.textContent = generation;
      }
    });

    // Update compact display if enabled.
    const chips = document.querySelector(".pl-vehicle-chips");

    if (chips && !chips.textContent.includes(generation)) {
      const chip = document.createElement("span");
      chip.className = "pl-chip";
      chip.textContent = generation;
      chips.prepend(chip);
    }
  };

  console.log("Generation labels enabled.");
})();

