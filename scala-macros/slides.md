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
# Credit
## Macros
### Eugene Burmako, @xeno-by
## Quasiquotes
### Denys Shabalin, @den_sh

!SLIDE
# Macro: two-faced `$%#`

## a definition

``` text/x-scala
def foo: Unit = macro fooMeta
```

## meta-program

``` text/x-scala
import scala.reflect.macros._
def fooMeta(c: BlackboxContext): c.Tree = { 
  import c.universe._; q"{}"
}
```

!NOTES
import scala.language.experimental.macros

!SLIDE
## <span class="tsblue">**meta**</span> &nbsp;&nbsp;&nbsp; greek for<br>"code analysing/generating code"

!SLIDE left
## meta-program

``` text/x-scala
def fooMeta(ctx: BlackboxContext): ctx.Tree
```

- has access to the compiler's guts via `ctx`
- yields a *representation* of an expression,<br>
in the current reflection universe<br>
(type depends on path `ctx`)

!NOTES
in the compiler, the `universe` is called `global`

!SLIDE left
## quasiquotes

``` text/x-scala
import c.universe._ // oh hi, I'm in your compiler!
q"{}" // quasi-quote
```

- `c.universe`: the compiler/reflection cake
- `q"{}"`: the data structure (AST) that<br>
represents the Scala program `{}`

!SLIDE left
## macro invocation

replaced by its expansion, as defined by the macro

``` text/x-scala
class C { def m = foo }
```

``` text/x-scala
:javap -c C
```

!SLIDE left
## meta-program
### BlackboxContext: "**b**enign"

- ignore macros when reading code
- type checking, IDE unaffected
- macro invocation = normal method invocation,<br>
  except for:
  - error/warning messages (or compiler crashes)
  - code generation

!SLIDE left
## meta-program
### WhiteboxContext: "**w**ildcard"
Macro expansion interferes with type checking, IDE.

- expansion determines type of macro call
- guides implicit search
- full type inference delayed until after expansion
- can be used in pattern match
 
!NOTES

extractor macros: https://github.com/paulp/scala/commit/84a335916556cb0fe939d1c51f27d80d9cf980dc
(rely on name-based patmat: https://github.com/scala/scala/pull/2848)


!SLIDE left
## wild`^W`whitebox

``` text/x-scala
import scala.reflect.macros._, scala.util.Random
def moodyMeta(c: WhiteboxContext): c.Tree = {
  import c.universe._
  if (Random.nextFloat > 0.5) q"1"
  else q""""one""""
}

def moody = macro moodyMeta
```

!SLIDE
## pop quiz
``` text/x-scala
moody - 1
```

!SLIDE
## IDE friendliness
- to auto complete on whitebox macro, IDE must run it
- Scala IDE for Eclipse does this, sees expanded code
- friendly macro [detects IDE](https://github.com/scala/async/blob/master/src/main/scala/scala/async/internal/AsyncBase.scala#L48), reports errors, doesn't expand
- we're working on supporting this in the macro api/tools

!SLIDE
## Applications

!SLIDE
## Code Generation

- faster code: [foreach](https://github.com/ochafik/Scalaxy/blob/master/Loops/src/main/scala/scalaxy/loops.scala), [specialized](http://lampwww.epfl.ch/~hmiller/scala2013/resources/pdfs/paper10.pdf), [fast || colls](https://github.com/scala-blitz/scala-blitz/tree/master/src/main/scala/scala/collection/par/workstealing/internal)
- ~~boilerplate~~: [quasiquotes](https://github.com/scala/scala/blob/master/src/compiler/scala/tools/reflect/quasiquotes/Quasiquotes.scala#L45), [play's json inception](https://github.com/playframework/playframework/blob/master/framework/src/play-json/src/main/scala/play/api/libs/json/JsMacroImpl.scala), [pickling](https://github.com/scala/pickling/blob/2.10.x/core/src/main/scala/pickling/Macros.scala),[source location](https://github.com/scala/scala/blob/master/test/files/run/macro-sip19-revised/Impls_Macros_1.scala)
- tracing / testing: [expecty](https://github.com/pniederw/expecty/blob/master/src/main/scala/org/expecty/RecorderMacro.scala), [specs2](https://github.com/etorreborre/specs2/blob/master/matcher-extra/src/main/scala/org/specs2/matcher/MatcherMacros.scala), [scalatest](https://github.com/scalatest/scalatest/blob/master/src/main/scala/org/scalatest/AssertionsMacro.scala)

!NOTES
http://infoscience.epfl.ch/record/185242/files/QuasiquotesForScala.pdf

!SLIDE
## Static Checks

- [spores](https://github.com/heathermiller/spores/blob/master/src/main/scala/scala/spores/package.scala): closure doesn't capture (accidentally)
- [`printf` string interpolator](https://github.com/scala/scala/blob/master/src/compiler/scala/tools/reflect/MacroImplementations.scala#L14)

!SLIDE
## DSLs

- SBT: `settings ( x.value )`
- async: `async { await(x) }`
- language virtualization

!SLIDE

## More examples 
###[Eugene's ScalaDays talk](http://scalamacros.org/paperstalks/2013-06-12-HalfYearInMacroParadise.pdf)
###[Eugene's Scala eXchange talk](http://skillsmatter.com/podcast/home/what-are-macros-good-for)
###[Eugene's StrangeLoop talk](https://github.com/xeno-by/StrangeLoop2013/blob/master/slides/sessions/Burmako-EvolutionOfScalaMacros.pdf)

!SLIDE left
# Pro Tips
- use quasiquotes
- mind your hygiene
  - be fresh with `freshName`
  - qualify fully, start at `_root_`
- prototype using `:power` and runtime reflection
- avoid `resetAttrs`, combine typed trees<br>(improving this = research)
- unit test [using toolbox compiler](https://github.com/scala/scala-continuations/blob/master/library/src/test/scala/scala/tools/selectivecps/CompilerErrors.scala#L227)

!SLIDE bigcode left
# Run-time Reflection

``` text/x-scala
import scala.reflect.runtime.universe._, scala.tools.reflect._

val tree = q"println(1)"
val id = show(tree)
val raw = showRaw(tree)

val toolbox = reflect.runtime.currentMirror.mkToolBox()
toolbox.eval(tree)
```

!SLIDE left
# Bigger Example
(Thanks @den_sh & @retronym!)

## Tuplification

``` text/x-scala
case class Person(name: String, age: Int)
tuplify(Person("a", 1)) == ("a", 1)
```

!SLIDE bigcode
``` text/x-scala
import language.experimental.macros
import scala.reflect.macros._

trait Helpers extends WhiteboxMacro { import c.universe._
  object CaseField {
    def unapply(f: TermSymbol): Option[(TermName,Type)] =
      if (f.isVal && f.isCaseAccessor)
        Some((TermName(f.name.toString.trim),
              f.typeSignature))
      else None
  }

  def validate(T: Type): Unit = {
    val sym = T.typeSymbol
    if (!(sym.isClass && sym.asClass.isCaseClass))
      c.abort(c.enclosingPosition,
               s"$sym is not a case class")
  }
}
```

!SLIDE bigcode
``` text/x-scala
trait AsTuple[T, U] { def toTuple(t : T): U }
object AsTuple {
  implicit def materializeAsTuple[T, U]
    :AsTuple[T, U] = macro Tuplify.meta[T, U]
}

trait Tuplify extends Helpers { import c.universe._
  type WTT[t] = c.WeakTypeTag[t]
  def meta[T: WTT, U: WTT]: c.Tree = {
    val T = c.weakTypeOf[T]; validate(T)
    val (sels, types) = T.declarations.collect { 
      case CaseField(f, tp) => (q"t.$f", tp)
    }.unzip
    q"""
    new AsTuple[$T, (..$types)] {
     def toTuple(t: $T) = (..$sels)
    }
    """
  }
}
```

!SLIDE bigcode
``` text/x-scala
case class Person(name: String, age: Int)

def tuplify[T, U](x: T)
   (implicit ev: AsTuple[T, U]): U
     = ev.toTuple(x)

tuplify(Person("a", 1))
```

!NOTES
without quasiquotes: https://github.com/scalamacros/kepler/blob/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923c/Macros_1.scala


!SLIDE
## BTW! Scala 2.11
### Smaller: slim down library
### Faster: speed up compiler
### Stabler: slow down change

!SLIDE
### Deprecated Aggressively

!SLIDE
### Modularized standard library
#### scala-swing
#### scala-parser-combinators
#### scala-xml –> roll your own!
#### scala-continuations[-plugin, -library]


!SLIDE
##scala-library 
### 2.10.4-RC1: 6.8 MB
### 2.11.0-M7: 5.6 MB (82%)

!SLIDE
## better incremental compiler 
### @gkossakowski

!SLIDE
## optimized compiler
### @retronym

!SLIDE
## better optimizer/codegen
### @magarciaEPFL, @jamesiry
## (experimental) 


!SLIDE
## M8, last milestone: Jan 10
## RC1: Feb 14

!SLIDE
# Thanks!

# Questions!

