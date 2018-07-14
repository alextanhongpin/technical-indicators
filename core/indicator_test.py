# python -m unittest indicator_test.py
import unittest

from indicator import sma_2

class IndicatorTest(unittest.TestCase):
  def test_sma2(self):
    tests = [
      (sma_2([]), 0),
      (sma_2([1]), 0),
      (sma_2([1, 0]), .5),
      (sma_2([0, 1, 0]), .5),
      (sma_2([0, 1, 1]), 1),
      (sma_2([0, 0, 1, 2]), 1.5),
    ]
    for got, expected in tests:
      self.assertEqual(got, 
                       expected, 
                       "should return the average of last two number")