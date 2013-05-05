# What's new in Scala 2.10

!SLIDE intro
# Scala 2.10!
<img height="50%" src="images/scala.png"/>
####  Jason Zaugg | [@retronym](http://twitter.com/retronym) | <img style="vertical-align: middle; display: inline; margin-top: 35px;" width="200px" src="http://typesafe.com/assets/images/typesafe@2x.png"/>

!SLIDE left top
# two dot ten

 * 18 months
 * 4376 commits
   * Now in Git(Hub)!
 * A handful of new features...
   * guided by the [SIP process](http://docs.scala-lang.org/sips/index.html)
   * documented on [docs.scala-lang.org](http://docs.scala-lang.org)
   * crafted to play nicely with each other

!SLIDE left top
# Highlights

  * String Interpolation ([SIP-11](https://docs.google.com/document/d/1NdxNxZYodPA-c4MLr33KzwzKFkzm9iW9POexT9PkJsU/edit?hl=en_US))
  * Value Classes ([SIP-15](https://docs.google.com/document/d/10TQKgMiJTbVtkdRG53wsLYwWM2MkhtmdV25-NZvLLMA/edit?hl=en_US))
  * Implicit Classes ([SIP-13](http://docs.scala-lang.org/sips/pending/implicit-classes.html))
  * Rewritten Pattern Matcher

!SLIDE left top
# Highlights

  * Feature Imports ([SIP-18](https://docs.google.com/document/d/1nlkvpoIRkx7at1qJEZafJwthZ3GeIklTFhqmXMvTX9Q/edit))
  * Futures and Promises ([SIP-14](http://docs.scala-lang.org/sips/pending/futures-promises.html))
  * Dependent method types
     * Factory methods for cakes.
  * ASM-based back-end <!-- (faster, adds basic 1.6/1.7 support) -->

!SLIDE left top
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

This presentation is __executable__.

```
sudo gem install keydown # optional
git clone git@github.com:retronym/talks.git
git clone -b topic/play-keydown git@github.com:retronym/replhtml.git && cd replhtml
$EDITOR src/main/resources/application.conf
sbt run
open http://localhost:8080
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

!SLIDE left top

# Why Martin hates String Interpolation.

<img src="images/keyboard.png" height="600px"/>

!SLIDE left

> On the issue of string interpolation I've always found Martin's stance to be rather puzzling. It just __looks__ ugly. And it's so hard to __type__!

Jorge Ortiz <img style="display: inline; vertical-align: middle" src="https://si0.twimg.com/profile_images/31208162/n201149_31531916_6855.jpg" height="60px"/>

!SLIDE left

> And then it hit me. Maybe __Swiss keyboards__ have more __convenient__ access to the `"+` and `+"` key combinations.

Jorge Ortiz <img style="display: inline; vertical-align: middle" src="https://si0.twimg.com/profile_images/31208162/n201149_31531916_6855.jpg" height="60px"/>

!SLIDE left

> But there you go: once again, Martin was right. Scala really doesn't need better string interpolation. I just need a __more-Swiss keyboard__.

[Jorge Ortiz scala-debate 2008](http://www.scala-lang.org/node/2025)

!SLIDE left top
# SIP-11 String Interp.

Actually, we just needed a take on interpolation that __feels right__ for Scala.

``` text/x-scala
val greetee = "flatMap(Oslo)"
s"Hello, $greetee!"
```

!SLIDE left

String interpolation is a rewriting rule*

``` text/x-scala
val greetee = "flatMap(Oslo)"
s"Hello, $greetee!"

StringContext("Hello ", "!").s(greetee)
```

*just like `for` comprehesions.


!SLIDE left

That was plain `s`-ubstitution.

We can also `f`-ormat:

``` text/x-scala
f"Pi = ${math.Pi}%.4f"
```

(Use `${<expr>}` to interpolate expressions.)


!SLIDE left

`f` is type-aware.

``` text/x-scala
f"Pi = ${false}%.4f"
```

Want to know how?

Come to my macro workshop!

!SLIDE left

This feature is __extensible__.

Enrich `StringContext` with new interpolators.

``` text/x-scala
implicit class RichStringContext
         (val sc: StringContext) extends AnyVal {
  def shouty(args: Any*) = sc.s(args: _*).toUpperCase
}
shouty"Is this thing turned on?"
```

!SLIDE left top

# Implicit Classes

 - Boilerplate free extension methods
 - Shorthand for a class + implicit def
 - Must nest (can be in package object)

``` text/x-scala
implicit class IC(wrapped: String) {
  def extensionMethod(a: Int) = wrapped.length + a
}
"".extensionMethod(0)
```

!SLIDE left top

# Feature Imports

Implicit classes make best practice use of implicits convenient.

``` text/x-scala
// maybe not such a great idea.
implicit def str2int(s: String) = s.length
```

More general implicit conversions now come with a warning.

!SLIDE left top

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

!SLIDE left top

# Value Classes

``` text/x-scala
class Meter(val value: Double) extends AnyVal {
  def +(other: Meter) = new Meter(value + other.value)
}
new Meter(0) + new Meter(2) // Unboxed
Array(new Meter(0))         // Boxed
```

!SLIDE left top
# Pat and Mat

<image src="images/patmat.JPG" height="600px"/>

!SLIDE left top
# virtpatmat

 - [@adriaanm](https://twitter.com/adriaanm)'s rewrite of the pattern matcher
 - A tidal wave of bug fixes:
   - ["... exponential-space bytecode"](https://issues.scala-lang.org/browse/SI-1133)
   - [Compiler generates wrong code...](https://issues.scala-lang.org/browse/SI-1697)
 - Better match analysis the patterns.

!SLIDE left top
# Exhaustivity

``` text/x-scala
def foo(a: Boolean, b: Boolean) =
  (a, b) match { case (true, false) =>  }
```

``` text/x-scala
def foo(a: Option[String]) =
  a match { case None | Some("!") =>  }
```

!SLIDE left top

# Smarter Warnings
``` text/x-scala
def list(as: Seq[Int]): List[Int] = as match {
  case li: List[Int] => li // used to be a warning
  case _             => List()
}
```

!SLIDE left top

# Smarter Warnings
``` text/x-scala
class C; class D;
def foo(c: C, d: D) = c == d
```

!SLIDE left top

# Public Service Announcement
``` text/x-scala
// what, no warning?
(1, 2) match { case Seq(x) =>; case _ => }
```

The compiler can't rule out:

  `class Z extends (A, B) with Seq[C]`.

!SLIDE left top

# Public Service Announcement
## Finality is your friend
``` text/x-scala
final case class T2[A, B](a: A, b: B)
T2(1, 2) match { case Seq(x) =>; case _ => }
```

`scala.TupleN` will be final in 2.12 (deprecation is a drag.)

Will be considered final for analyses under `-Xlint` in 2.11

!SLIDE left top
# Dynamic

``` text/x-scala
import language.dynamics
class dyno(val stack: List[String] = Nil)
  extends Dynamic {
  def selectDynamic(name: String) =
    new dyno(name :: stack)
}
new dyno().foo.bar.baz.stack
```

!SLIDE left top
# Dynamic

``` text/x-scala
import language.dynamics
class dyno(val stack: List[String] = Nil)
  extends Dynamic {

  def applyDynamic(name: String)(args: Any*) =
   applyDynamicNamed(name)(args.map(("<>",  _)): _*)

  def applyDynamicNamed(name: String)
                       (args: (String, Any)*) = {
    val str = s"$name(${args.mkString(", ")})"
    new dyno(str :: stack)
  }
}

new dyno().foo(a = 1).bar(true).stack
```

!SLIDE left top

# Dynamic

 * Applications:
   * Querying JSON
   * Calling web services
   * Cute Reflection APIs

But can we agree __not__ to emulate ActiveRecord's<p/> [`find_by_user_name_and_password`](https://github.com/rails/rails/blob/277c799/activerecord/lib/active_record/base.rb#L1832-L1846)?

!SLIDE left top
# What I haven't covered

 - `scala.concurrent._`
   - scala-async
 - Reflection / Macros (experimental)

!SLIDE left top
# 2.11

  * Smaller
    * Modularizing std lib & compiler
  * Faster
    * Better optimizer (@jamesiry)
    * Incremental compiler (@gkossakowski)
    * Shorter compile times
  * Stabler
    * Mature 2.10's experimental features

!SLIDE
# Thanks!

# Questions!



