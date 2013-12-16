# Scala Macros

!SLIDE intro
# Scala Macros
#### Adriaan Moors | [@adriaanm](http://twitter.com/adriaanm) | [Typesafe](http://typesafe.com)

!SLIDE 
## Macros are Experimental

!SLIDE 
## Best to Avoid Them

!SLIDE 
## Questions?


!SLIDE
# Macro?

## method run by type checker



!SLIDE
# Macro: two-faced `$%#`

## a definition

``` text/x-scala
def foo = macro fooMeta
```
## meta-program

``` text/x-scala
import reflect.macros._
def fooMeta(c: BlackboxContext): c.Expr[Unit] = { 
  import c.universe._; c.Expr(q"""{}""")
}
```

!SLIDE
## **meta:** greek for<br>"code analysing/generating code"

!SLIDE
## meta-program

``` text/x-scala
def fooMeta(ctx: BlackboxContext): ctx.Expr[Unit]
```

- can access meta-level, aka compiler's guts (ctx)
- `ctx.Expr[T]` is the *representation* of an expression of type T

!SLIDE
## quasi-quotes

``` text/x-scala
import c.universe._ // oh hi, I'm in your compiler!
c.Expr(
  q"""{}""" // quasi-quote
)
```

`q"""{}"""` is the data structure (AST)<br>
that represents the Scala program `{}`

!SLIDE left
## meta-program
### BlackboxContext: benign
- can understand macro call without knowing its expansion
- macro call behaves just like method call
- cognitive burden low, IDEs aren't bothered
- can still emit errors/warnings

!SLIDE left
## meta-program
### WhiteboxContext: wildcard
Macro expansion required to:
- determine type of macro invocation
- perform type inference (delayed until after expansion)
- resolve implicits 
- compile pattern match
 
!NOTES
source location: https://github.com/scala/scala/blob/master/test/files/run/macro-sip19-revised/Impls_Macros_1.scala
extractor macros: https://github.com/paulp/scala/commit/84a335916556cb0fe939d1c51f27d80d9cf980dc
(rely on name-based patmat: https://github.com/scala/scala/pull/2848)

!SLIDE
## macro invocation

replaced by its expansion, as defined by the meta-program

``` text/x-scala
class C { def m = foo }
```

``` text/x-scala
:javap -c C
```

!NOTES
# Macros are experimental

``` text/x-scala
import scala.language.experimental.macros
import scala.reflect.macros.Context
```

!SLIDE
# Example #0
## Macro Implementation
``` text/x-scala
def noopImpl(c: Context)
    (x: c.Expr[Any]): c.Expr[Unit] = { import c.universe._
 c.Expr(q"""{}""")
}
```

!SLIDE
# Example #0
## Macro Def
``` text/x-scala
def noop(x: Any): Unit = macro noopImpl

class Test { def t = noop("x") }
```

!SLIDE
# Example #0
## Macro Expansion
``` text/x-scala
:javap -c Test
```

!SLIDE
# [scala async](https://github.com/scala/async)

``` text/x-scala
def combined: Future[Int] = async {
  val future1 = slowCalcFuture
  val future2 = slowCalcFuture
  await(future1) + await(future2)
}
```

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

  
typesafe proxy
https://gist.github.com/paulp/5265030

!SLIDE left
# Scala 2.11
## Smaller  
  * Deprecated Aggressively

!SLIDE left
# Scala 2.11
## Smaller
  * Modularized standard library
    * (scala-actors)
    * scala-parser-combinators
    * scala-swing
    * scala-xml --> roll your own!
    * scala-continuations[-plugin, -library]

!SLIDE left
# Scala 2.11
## Smaller
  * scala-library 
    * 2.10.4-RC1: 6.8 MB
    * 2.11.0-M7: 5.6 MB (82%)

!SLIDE left
# Scala 2.11
## Faster

  * Incremental compiler<br>
    (@gkossakowski)
  * Compiler optimization<br>
    (@retronym)
  * Experimental better optimizer/codegen<br>
    (@magarciaEPFL, @jamesiry)



!SLIDE
# Thanks!

# Questions!

