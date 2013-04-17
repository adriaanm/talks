# What's new in Scala 2.10

!SLIDE intro
# Scala 2.10!
#### Adriaan Moors | [@adriaanm](http://twitter.com/adriaanm) | [Typesafe](http://typesafe.com)

!SLIDE days
#[Scala Days](http://scaladays.org)

### **ScalaDays13SFScala**
### 20% discount
### June 10th-12th 2013, NYC
	
!SLIDE
# Scala
## Simple

!SLIDE
# Scala
## I'm serious.


!SLIDE
# Scala = Unifier

  * Functions (small abstractions)
  * Objects and traits (big abstractions)

!SLIDE left
# Scala = Unifier

  * Type inference
  * Value inference (`implicit val`)
  * Here be (cool) dragons
     * specs, shapeless, scalaz,...
     * [paper] fighting bitrot with types
     * [paper] type classes as objects and implicits


!SLIDE
# Scala = Unifier

  * Experimentation
  * Large-scala`^H`e development

!SLIDE
# Experimenting
## Queue demo effect

``` text/x-scala
println("")
```

!SLIDE top
# Behind the scenes
``` text/x-scala
import unfiltered.netty.websockets._

val sockets = ListBuffer.empty[WebSocket]
WebSocketServer("/socket/repl", 8080) {
  case Open(s) => sockets += s
  case Message(s, Text(str)) =>
    val resp = interpret(str)
    sockets foreach (_.send(resp))
} run ()
```

!SLIDE top
# Behind the scenes
``` text/x-scala
val interpreter = new IMain(settings)
val completion  = new JLineCompletion(interpreter)

def interpret(data: String): String = {
  data.split(":", 2) match {
    case Array("run", source) =>
      util.stringFromStream { ostream =>
        Console.withOut(ostream) {
          interpreter.interpret(source) } }
    case Array(r"""complete@(\d*)${I(pos)}""", source) =>
      // handle completion at position $pos
  }
}
```

#### [Full code](https://github.com/adriaanm/replhtml/blob/master/src/main/scala/ReplMain.scala)


!SLIDE
# To be continued


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
     * (cake factory methods)
  * ASM-based back-end <!-- (faster, adds basic 1.6/1.7 support) -->

!SLIDE left
# Scala 2.10 highlights

  * trait Dynamic ([SIP-17](https://docs.google.com/document/d/1XaNgZ06AR7bXJA9-jHrAiBVUwqReqG4-av6beoLaf3U/edit))
  * Reflection (experimental, [overview](http://docs.scala-lang.org/overviews/reflection/overview.html))
  * Macros (experimental, [SIP-16](http://docs.scala-lang.org/overviews/macros/overview.html))


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


!SLIDE left
# Scala = Unifier

  * Extractors reconcile
    * Pattern matching
    * OO Encapsulation
  * Requires Option boxing
    * Tackling this in 2.11
    * Value classes meet patmat


!SLIDE
# Extractors

``` text/x-scala
object I {
  def unapply(x: String) = util.Try { x.toInt } toOption
}

"10" match { case I(10) => }

I.unapply("10") match { case Some(10) => }
```

(New in 2.10: `Try`, based on Twitter's com.twitter.util.)

!NOTES
import language.postfixOps

!SLIDE
# String interpolation

``` text/x-scala
def bottles(n: String)       = s"$n bottles of beer"

def safeBottles(n: Int)      = f"$n%d bottles of beer"

def brokenBottles(n: Double) = f"$n%d bottles of beer"
```

!NOTES
this is the unifier of the talk
implicit classes
value classes
string interpolators
patmat & objects
macros (printf-style validation)


!SLIDE left
# String interpolation

  1. drop $-prefixed holes
  1. pack parts in a `StringContext`
  1. call the interpolator (named in the prefix)
  1. pass the holes as arguments

!SLIDE
# Desugaring interpol

``` text/x-scala
// def bottles(n: String) = s"$n bottles of beer"
def bottles(n: String) = StringContext("", " bottles of beer").s(n)
```

Somewhere, in the standard library:

``` text/x-scala
case class StringContext(parts: String*) {
  def s(args: Any*): String = standardInterpolator(treatEscapes, args)
}
```

!SLIDE
# Interpol & macros
### Where'd my StringContext go?

``` text/x-scala
def safeBottles(n: Int) = "%d bottles of beer" format n
```

There's a [macro](https://github.com/scala/scala/blob/master/src/compiler/scala/tools/reflect/MacroImplementations.scala#L13) for that.

``` text/x-scala
case class StringContext(parts: String*) {
  // check that types, number of `args` correspond to formatter in `parts`
  def f(args: Any*): String = macro macro_StringInterpolation_f
}
```

!SLIDE
# Interpol & patmat
### And now... in reverse!?

``` text/x-scala
"10 bottles" match {
  case r"""\d* bottles""" => "ok!"
}
```

### Can this work?


!SLIDE
# Interpol & patmat
### Sure, let's dissect

``` text/x-scala
val Pattern = r"""\d* bottles"""

"10 bottles" match {
  case Pattern() => "ok!"
}
```

  * Interpolated strings are first-class.
  * No need to first put it in a `val`.
    * Uniformity ~> simplicity
  * If we can make this work, so will the original

!SLIDE
# Interpol & patmat
### Desugaring the extractor

``` text/x-scala
val Pattern = r"""\d* bottles"""

Pattern.unapplySeq("10 bottles") match {
  case Some(_) => "ok!"
}
```

  * `unapplySeq` generalizes `unapply` <br> to variable number of subpatterns


!SLIDE
# Interpol & patmat
### Desugaring interpol

``` text/x-scala
val Pattern = StringContext("""\d* bottles""").r
```

### Problem reduced

  * add a method `r` to `StringContext`
  * `r` returns an extractor with `unapplySeq` method

!SLIDE
# `implicit` meets `class`

``` text/x-scala
implicit class RContext(sc: StringContext) {
 def r = new util.matching.Regex(
    sc.parts.mkString(""), 
    sc.parts.tail.map(_ => "x"): _*
  )
}
```

  * `implicit class` encapsulates<br>best practice implicit conversions
  * before, only `implicit` `val` or `def`
    * `y no implicit class!?`


!SLIDE
# Interpol & patmat

``` text/x-scala
implicit class RContext(sc: StringContext) {
 def r = new util.matching.Regex(
    sc.parts.mkString(""), 
    sc.parts.tail.map(_ => "x"): _*
  )
}

val n = "10 bottles" match { 
 case r"""(\d*)$n bottles""" => n 
}
```

!SLIDE
# Supreme thrift

``` text/x-scala
val r"""(\d*)${I(n)} bottles""" = "10 bottles"
```

Note: `n` is an `Int`!

!SLIDE
# Interpol & patmat
Cool applications/articles:

  * [Quasi quotes](http://docs.scala-lang.org/overviews/macros/quasiquotes.html)
  * [From Kiama team](http://hootenannylas.blogspot.com.au/2013/02/pattern-matching-with-string.html)


!SLIDE
# Scala 2.10 got bigger
## Simple?

!SLIDE
# Scala 2.10 got bigger
## Complex?

!SLIDE
# Scala 2.10 got bigger
## Complicated?


!SLIDE left
# Simplicity

  * New feature = investment
  * Make it count
  * Simplicity through uniformity
  * Not bolted on, but fused with the core


!SLIDE left
# Standing on a simple core

  * Simple yet sophisticated core
  * Many cool manifestations
  * Many in libraries
  * Many by you


!SLIDE
# Scala 2.10 got bigger
## As a community, find our voice




typesafe proxy
https://gist.github.com/paulp/5265030

typesafe dictionary:
???

 
!NOTES 
# Scala = Pragmatic

  * Immutable / pure encouraged.
  * Mutation  / impure where you need it. -->

!NOTES
``` text/x-scala
import concurrent._; import ExecutionContext.Implicits.global
var y = 0
Future { y = 1 } ; Future { y = 2 }
```




!SLIDE
#