# What's new in Scala 2.10

!SLIDE intro
# Scala 2.10!
#### Adriaan Moors | [@adriaanm](http://twitter.com/adriaanm) | [Typesafe](http://typesafe.com)

!SLIDE days
#[Scala Days](http://scaladays.org)

### **ScalaDays13SFScala**
### 20% discount
### June 10th-12th 2013, NYC

!SLIDE center
# Scala
## Simple.

!SLIDE center
# Scala
## I'm serious.

!SLIDE center
# Scala
## I'll be convincing.

!SLIDE left
# Scala = Unifier

  * Experimentation
  * Large-scala^He development

!SLIDE left
# Scala = Unifier

  * Functions (Small abstractions.)
  * Objects and traits (Big abstractions.)




!NOTES
# Scala = Pragmatic

  * Immutable / pure encouraged.
  * Mutation  / impure where you need it. -->

!SLIDE
``` text/x-scala
import concurrent._; import ExecutionContext.Implicits.global
var y = 0
Future { y = 1 } ; Future { y = 2 }
```

!SLIDE left
# Scala = Unifier

  * Patterns (case classes)
  * Objects  (extractors)

!SLIDE left
# Scala = Unifier

  * Value inference (implicits)
  * Type inference
  * Here be (cool) dragons
     * specs, shapeless, scalaz,...
     * fighting bitrot with

!SLIDE
# Scala 2.10 got bigger
## Simple?

!SLIDE
# Scala 2.10 got bigger
## Complex?

!SLIDE left
# Scala 2.10 got bigger
## Complicated?

!SLIDE left
# Scala 2.10 got bigger
## Sophisticated?

!SLIDE left
# Scala 2.10 got bigger
## Leave it to the philosophers.

!SLIDE left
# Scala 2.10 got bigger
## As a community, finding our voice.

!SLIDE left

# Scala 2.10 highlights:

  * Value Classes
  * Implicit Classes
  * String Interpolation
  * Rewritten Pattern Matcher

!SLIDE left

  * Feature Imports (SIP-18)
  * Futures and Promises (SIP-14)
  * trait Dynamic
  * Macros & Reflection (experimental)
  * ASM-based back-end <!-- (faster, adds basic 1.6/1.7 support) -->

!SLIDE left

# Some sample code


!NOTES

 * a note

!SLIDE

