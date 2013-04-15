# scala-2.10

!SLIDE intro

# Scala 2.10!


#### Adriaan Moors | [@adriaanm](http://twitter.com/adriaanm) | [Typesafe](http://typesafe.com)


!SLIDE left

Tonight:

  * Value Classes
  * Implicit Classes
  * String Interpolation
  * trait Dynamic
  * Macros & Reflection (experimental)
  * Rewritten Pattern Matcher
  * Feature imports

!SLIDE
Also:

  - ASM-based backend <!-- (faster, adds basic 1.6/1.7 support) -->
  - Futures and Promises <!-- (collaboration between EPFL’s Scala team, the Akka team at Typesafe with input from Twitter) -->
  - Akka actors in the standard distribution

# Some sample code

``` text/x-scala
class Meter(x: Double) extends AnyVal
```

!NOTES

 * a note

!SLIDE

