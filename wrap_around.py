from math import sqrt

def rightToLeft(current, length):
  return ((current + 1) % length)

def leftToRight(current, length):
  return ((length - 1) - ((length - current) % length))

print(rightToLeft(6, 7))
print(leftToRight(0, 7))