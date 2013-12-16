# Scala Macros

!SLIDE intro
# Scala Macros
#### Adriaan Moors | [@adriaanm](http://twitter.com/adriaanm) | [Typesafe](http://typesafe.com)

!SLIDE
# What

- a method evaluated by the type checker

- a macro invocation expression is replaced by its expansion
- has access to the surrounding program

!SLIDE
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
}```

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
