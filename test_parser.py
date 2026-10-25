import unittest
from sync_yards import parse
class ParserTest(unittest.TestCase):
 def test_lkq_card(self):
  html='<h3>2015 HONDA CR-Z</h3><div>Blue · 1581-94613 Yard location Section Front Yard | Row A | Space 3 VIN JHMZF1D63FS001455 Available 10/23/2026</div>'
  cars=parse(html,'north')
  self.assertEqual(len(cars),1)
  self.assertEqual(cars[0]['vin'],'JHMZF1D63FS001455')
  self.assertEqual(cars[0]['row'],'A')
  self.assertEqual(cars[0]['model'],'Cr-Z')
 def test_no_fake_cars(self):self.assertEqual(parse('<h3>Latest News</h3>','south'),[])
if __name__=='__main__':unittest.main()
