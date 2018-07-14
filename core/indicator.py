from functools import partial

def mean(arr):
  return sum(arr) / len(arr)

def sma(rng, arr):
  if len(arr) < rng:
    return 0
  return mean(arr[-rng:])

sma_2 = partial(sma, 2)
