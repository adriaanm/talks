# What's new in Scala 2.10

!SLIDE intro
# Scala 2.10!
<img height="50%" src="images/scala.png"/>
####  Jason Zaugg | [@retronym](http://twitter.com/retronym) | <img style="vertical-align: middle; display: inline; margin-top: 35px;" width="200px" src="http://typesafe.com/assets/images/typesafe@2x.png"/>

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

!SLIDE
# Scala
## Welcome to Scala 2.10!

!SLIDE left
# two dot ten

 * 18 months
 * 4376 commits
   * Now in Git(Hub)!
 * A handful of new features...
   * guided by the [SIP process](http://docs.scala-lang.org/sips/index.html)
   * documented on [docs.scala-lang.org](http://docs.scala-lang.org)
   * crafted to play nicely with each other

!SLIDE left
# Highlights

  * String Interpolation ([SIP-11](https://docs.google.com/document/d/1NdxNxZYodPA-c4MLr33KzwzKFkzm9iW9POexT9PkJsU/edit?hl=en_US))
  * Value Classes ([SIP-15](https://docs.google.com/document/d/10TQKgMiJTbVtkdRG53wsLYwWM2MkhtmdV25-NZvLLMA/edit?hl=en_US))
  * Implicit Classes ([SIP-13](http://docs.scala-lang.org/sips/pending/implicit-classes.html))
  * Rewritten Pattern Matcher

!SLIDE left
# Highlights

  * Feature Imports ([SIP-18](https://docs.google.com/document/d/1nlkvpoIRkx7at1qJEZafJwthZ3GeIklTFhqmXMvTX9Q/edit))
  * Futures and Promises ([SIP-14](http://docs.scala-lang.org/sips/pending/futures-promises.html))
  * Dependent method types
     * Factory methods for cakes.
  * ASM-based back-end <!-- (faster, adds basic 1.6/1.7 support) -->

!SLIDE left
# Highlights

  * trait Dynamic ([SIP-17](https://docs.google.com/document/d/1XaNgZ06AR7bXJA9-jHrAiBVUwqReqG4-av6beoLaf3U/edit))
  * Reflection (experimental, [overview](http://docs.scala-lang.org/overviews/reflection/overview.html))
  * Macros (experimental, [SIP-16](http://docs.scala-lang.org/overviews/macros/overview.html))

!SLIDE left

  Our journey starts with a humble string.

``` text/x-scala
"Hello, flatMap(Oslo)!"
```

!SLIDE left

> In the Age of the Internet, strings are the new integers: everyone's using them for everything.

[Henney, 2000](http://collaboration.cmc.ec.gc.ca/science/rpn/biblio/ddj/Website/articles/CUJ/2001/cexp1911/henney/henney.htm)

!SLIDE left

A dozen years later, and they are still as popular.

``` text/x-scala
val greetee = "flatmap(Oslo)"
"Hello, "+greetee+"!"
```

Scala has `"regular"` and `"""multiline"""` strings.

How about `"$interpolation"`?


!SLIDE

# Why Martin hates String Interpolation.

<img src="images/keyboard.png" height="600px"/>

!SLIDE

> On the issue of string interpolation I've always found Martin's stance to be rather puzzling. It just __looks__ ugly. And it's so hard to __type__!

Jorge Ortiz. <img src="https://si0.twimg.com/profile_images/31208162/n201149_31531916_6855.jpg" height="60px"/>

!SLIDE

> And then it hit me. Maybe __Swiss keyboards__ have more __convenient__ access to the `"+` and `+"` key combinations.

Jorge Ortiz. <img src="https://si0.twimg.com/profile_images/31208162/n201149_31531916_6855.jpg" height="60px"/>

!SLIDE

> But there you go: once again, Martin was right. Scala really doesn't need better string interpolation. I just need a more-Swiss keyboard.

[Jorge Ortiz scala-debate 2008](http://www.scala-lang.org/node/2025)

!SLIDE
# SIP-11 String Interp.

Actually, we just needed a take on interpolation that __feels right__ for Scala.

``` text/x-scala
val greetee = "flatMap(Oslo)"
s"Hello, $greetee!"
```

!SLIDE

String interpolation is a rewriting rule*

``` text/x-scala
val greetee = "flatMap(Oslo)"
s"Hello, $greetee!"

StringContext("Hello", "!").s(greetee)
```

*just like `for` comprehesions.


!SLIDE

That was plain `s`-ubstitution.

We can also `f`-ormat:

``` text/x-scala
f"Pi = ${math.Pi}%.4f"
```

(Use `${<expr>}` to interpolate expressions.)


!SLIDE

`f` is type-aware.

``` text/x-scala
f"Pi = ${false}%.4f"
```

(Want to know how? Come to my workshop!)

!SLIDE

This feature is __extensible__.

Enrich `StringContext` with new interpolators.

``` text/x-scala
implicit class RichStringContext(val sc: StringContext) extends AnyVal {
  def shouty(args: Any*) = sc.s(args: _*).toUpperCase
}
shouty"can anyone hear me?"
```

!SLIDE

# Implicit Classes

 - Boilerplate free extension methods
 - Shorthand for a class + implicit def
 - Must nest (can be in package object)

``` text/x-scala
implicit class RichStringContext(sc: StringContext) {
  def shouty(args: Any*) = sc.s(args: _*).toUpperCase
}
shouty"can anyone hear me?"
```

!SLIDE

# Feature Imports

We saw how implicit classes make best practice use of implicits convenient.

More general implicit conversions now come with a warning.

``` text/x-scala
implicit def str2int(s: String) = s.length
```

!SLIDE

# Value Classes

 - Allocation free classes*

``` text/x-scala
implicit class Ext(val i: Int) extends AnyVal {
  def isPositive = i > 0
}
0.isPositive
// Ext.isPositive$extension(0)
```
*well, not entirely.

!SLIDE

# Value Classes

``` text/x-scala
class Meter(val value: Double) extends AnyVal {
  def +(other: Meter) = new Meter(value + other.value)
}
new Meter(0) + new Meter(2) // Unboxed
Array(new Meter(0))         // Boxed
```

!SLIDE
# Pat and Mat

<image src="images/patmat.JPG" height="600px"/>

!SLIDE
# virtpatmat

 - [@adriaanm](https://twitter.com/adriaanm)'s rewrite of the pattern matcher
 - A tidal wave of bug fixes:
   - ["... exponential-space bytecode"](https://issues.scala-lang.org/browse/SI-1133)
   - [Compiler generates wrong code...](https://issues.scala-lang.org/browse/SI-1697)
 - Better match analysis the patterns.

!SLIDE
# Exhaustivity

``` text/x-scala
def foo(a: Boolean, b: Boolean) =
  (a, b) match { case (true, false) =>  }
```

``` text/x-scala
def foo(a: Option[String]) =
  a match { case None | Some("!") =>  }
```

!SLIDE

# Smarter Warnings
``` text/x-scala
def list(as: Seq[Int]): List[Int] = as match {
  case li: List[Int] => li // used to be a warning
  case _             => List()
}
```

!SLIDE

# Smarter Warnings
``` text/x-scala
class C; class D;
def foo(c: C, d: D) = c == d
```


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
     * Factory methods for cakes.
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

!SLIDE left
# Scala = Unifier

  * Type inference
  * Value inference (`implicit val`)
  * Here be (cool) dragons
     * specs, shapeless, scalaz,...
     * [paper] fighting bitrot with types
     * [paper] type classes as objects and implicits

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

!SLIDE
# Scala 2.10 got bigger
## Simplistic?


!SLIDE left
# Simplicity

  * New feature = investment
  * Make it count
  * Simplicity through uniformity
  * Not bolted on, but fused with the core


!SLIDE left
# Standing on simple core

  * Simple yet sophisticated core
  * Many cool manifestations
  * Many in libraries
  * Many by you


!SLIDE 
# Scala = Pragmatic

  * Balance
    * Java interop
    * Legacy
    * Desire for new toys
  * With
    * Make programming fun
    * Sanity
    * Simplicity

!SLIDE 
# Scala = Pragmatic

  * Immutable / pure encouraged.
  * Mutation  / impure where you need it.


!SLIDE
# Asynch meets Mutation
## Because we can

``` text/x-scala
import concurrent._; import ExecutionContext.Implicits.global

var y = 0

Future { y = 1 } ; Future { y = 2 }
```

## doesn't mean you should
### (this generalizes)

!SLIDE
# Asynchronicity
## Futures

``` text/x-scala
def slowCalcFuture: Future[Int] = ...
val future1 = slowCalcFuture
val future2 = slowCalcFuture
def combined: Future[Int] = for {
  r1 <- future1
  r2 <- future2
} yield r1 + r2
```

!SLIDE
# Asynchronicity
## [scala-async](https://github.com/scala/async)

``` text/x-scala
def combined: Future[Int] = async {
  val future1 = slowCalcFuture
  val future2 = slowCalcFuture
  await(future1) + await(future2)
}
```

!SLIDE
# Types are there for you

  * `Future[T]` vs `T`
    * important difference
    * `Future[T]` keeps latency,<br>error handling on your mind


!SLIDE
# `import language._`
## SIP-18 helps you KISS

  * Help you identify Good Parts for
    * your project, and
    * your team,
    * at this time.
  * Desirable subset of Scala evolves.

!SLIDE
# `import language._`

  * postfixOps
  * reflectiveCalls
  * implicitConversions
  * existentials
  * higherKinds
  * dynamics
  * experimental.macros

!SLIDE
# `Dynamic`

``` text/x-scala
class AnythingGoes extends Dynamic {
  def applyDynamic(selection: String)(args: Any*): Any =
    println(s"You called $selection${args.mkString("(", ",", ")")}. Thanks!")
}
```

!NOTES
import language.dynamics
(new AnythingGoes).notInspired("sorry")

!SLIDE
# `Dynamic` meets `macro`
## By @paulp

<pre>
scala> val dict = Dict.dict
dict: Dict = Dict(88629 words, 103040 definitions)

// safe, unsafe, it's all the same if we know what we're doing
scala> dict.unsafeOracle.flibbertigibbet
res1: Definitions = 
flibbertigibbet
Flib"ber*ti*gib`bet, n.Defn: An imp. Shak.

scala> dict.safeOracle.flibbertigibbet
res2: Definitions = 
flibbertigibbet
Flib"ber*ti*gib`bet, n.Defn: An imp. Shak.
</pre>

!SLIDE
# `Dynamic` meets `macro`
## By @paulp

<pre>
// it is when we make up supposed "crazy, made-up" words that we
// enjoy the difference
scala> dict.unsafeOracle.bippy
res3: Definitions = Runtime Vocabulary Failure: No Such Word

scala> dict.safeOracle.bippy
<console>:9: error: not found: "bippy"
              dict.safeOracle.bippy
                   ^
</pre>

!NOTES
typesafe proxy
https://gist.github.com/paulp/5265030



!SLIDE left
# Scala 2.11

  * Smaller
    * Modularizing std lib & compiler
  * Faster
    * Better optimizer (@jamesiry)
    * Incremental compiler (@gkossakowski)
    * Shorter compile times
  * Stabler
    * Mature 2.10's experimental features

<p/>
(BTW, default target will be Java 6)

!SLIDE
# Thanks!

# Questions!



