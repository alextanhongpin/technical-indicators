
## Table of Content

- [Technical Overlays](#technical-overlays)
  - [Bollinger Bands](#bollinger-bands)
  - [Chandelier Exit](#chandelier-exit)
- [Reference](#reference)


# [Technical Overlays](#technical-overlays)

## [Bollinger Bands](#bollinger-bands)

A chart overlay that shows the upper and lower limits of 'normal' price movements based on the Standard Deviation of prices.

```
* Middle Band = 20-day simple moving average (SMA)
* Upper Band = 20-day SMA + (20-day standard deviation of price x 2) 
* Lower Band = 20-day SMA - (20-day standard deviation of price x 2)
```

In python:

```python
import numpy as np

a = []

# Standard deviation
std = np.std(a, dtype=np.float64)

# Average
sma = np.average(a)

upper = sma + std * 2
lower = sma + std * 2
```

Depends on: SMA

## [Chandelier Exit](#chandelier-exit)

An indicator that can be used to set trailing stop-losses for both long and short position

```
Chandelier Exit (long) = 22-day High - ATR(22) x 3 
Chandelier Exit (short) = 22-day Low + ATR(22) x 3
```

In python:

```python
a = []
high_22 = max(a)
low_22 = min(a)

# TODO: Get ATR value
```

Depends on: ATR

# [Reference](#reference)

- http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators
