# What's new in Scala 2.10

!SLIDE intro
# Pozdravljeni, Ljubljana!
#### Adriaan Moors | [@adriaanm](http://twitter.com/adriaanm) | [Typesafe](http://typesafe.com)

!SLIDE days
#[Scala Days](http://scaladays.org)

### June 10th-12th 2013, NYC

!SLIDE left
# Hi!

  * Thank you, [contributors!](https://github.com/scala/scala/contributors)
  * Some numbers
     * Mailing list members: `>`4K
     * Issue tracker
        * `>`3K registered users (2K not on mailing list)
        * `>`7K reported issues
          * top-11: 25%, top-55: 50%, top-1100: 95%
        * 5 issues/day
     * GitHub
        * Close 6 PR/day


!SLIDE left
# Scala 2.10 highlights

  * Rewritten Pattern Matcher
  * String Interpolation ([SIP-11](https://docs.google.com/document/d/1NdxNxZYodPA-c4MLr33KzwzKFkzm9iW9POexT9PkJsU/edit?hl=en_US))
  * Value Classes ([SIP-15](https://docs.google.com/document/d/10TQKgMiJTbVtkdRG53wsLYwWM2MkhtmdV25-NZvLLMA/edit?hl=en_US))
  * Implicit Classes ([SIP-13](http://docs.scala-lang.org/sips/pending/implicit-classes.html))

!SLIDE left
# Scala 2.10 highlights

  * Feature Imports ([SIP-18](https://docs.google.com/document/d/1nlkvpoIRkx7at1qJEZafJwthZ3GeIklTFhqmXMvTX9Q/edit))
  * Futures and Promises ([SIP-14](http://docs.scala-lang.org/sips/pending/futures-promises.html))
  * Dependent method types
     * Factory methods for cakes.
  * ASM-based back-end <!-- (faster, adds basic 1.6/1.7 support) -->

!SLIDE left
# Scala 2.10 highlights

  * trait Dynamic ([SIP-17](https://docs.google.com/document/d/1XaNgZ06AR7bXJA9-jHrAiBVUwqReqG4-av6beoLaf3U/edit))
  * Reflection (experimental, [overview](http://docs.scala-lang.org/overviews/reflection/overview.html))
  * Macros (experimental, [SIP-16](http://docs.scala-lang.org/overviews/macros/overview.html))


!SLIDE left
# Scala 2.11

  * Smaller
    * Modularizing std lib & compiler
    * Smaller core, faster release cycle for "power pack"
  * Faster
    * Incremental compiler (@gkossakowski)
    * Better optimizer (@jamesiry)
  * Stabler
    * Mature 2.10's experimental features
    * Blackbox macros officially supported


!SLIDE left
# Pattern matcher

  * Rewritten from scratch
  * Dozen long-standing bugs fixed
    * Favorite: [exponential-space bytecode](https://issues.scala-lang.org/browse/SI-1133)
    * Total: [close to 100](https://issues.scala-lang.org/sr/jira.issueviews:searchrequest-printable/12201/SearchRequest-12201.html?tempMax=1000)
  * Modular, grokkable [implementation](https://github.com/scala/scala/tree/2.10.x/src/compiler/scala/tools/nsc/transform/patmat)

!SLIDE left
# Pattern matcher
### New and improved

  * Extractors can be extension methods
  * Nicer error messages via SAT solving
  * "Virtualized": e.g., match in the [probability monad](https://github.com/namin/scala/blob/topic-virt-patmat-2.10.0/test/files/run/virtpatmat_problang3.scala)


!SLIDE
# Exhausting
## 

``` text/x-scala
def check(x: Option[String]) = x match {
  case Some("magic") =>
}
```

!NOTES
case Some(_) =>
case None =>

check(None)


!SLIDE
# Scala = Unifier

  * Functions (small abstractions)
  * Objects and traits (big abstractions)


!SLIDE
# Scala = Unifier

  * Experimentation
  * Large-scala`^H`e development


!SLIDE left
# Scala = Unifier

  * Extractors reconcile
    * Pattern matching
    * OO Encapsulation
  * Requires Option boxing
    * Tackling this in 2.11
    * Value classes meet patmat


!SLIDE left
# Scala = Unifier

  * Type inference
  * Value inference (`implicit val`)
  * Here be (cool) dragons
     * specs, shapeless, scalaz,...
     * [paper] fighting bitrot with types
     * [paper] type classes as objects and implicits



