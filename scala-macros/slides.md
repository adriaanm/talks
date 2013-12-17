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
def foo: Unit = macro fooMeta
```

## meta-program

``` text/x-scala
import reflect.macros._
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
- yields a *representation* of expression of type `T`,<br>
in the current reflection universe<br>
(type depends on path `ctx`)

!NOTES
in the compiler, the `universe` is called `global`

!SLIDE left
## quasi-quotes

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
  - error/warning messages
  - code generation

!SLIDE left
## meta-program
### WhiteboxContext: "**w**ildcard"
Macro expansion interferes with type checking, IDE.

- expansion determines type of macro call
- guides implicit search
- type inference delayed until after expansion
- can be used in pattern match
 
!NOTES

extractor macros: https://github.com/paulp/scala/commit/84a335916556cb0fe939d1c51f27d80d9cf980dc
(rely on name-based patmat: https://github.com/scala/scala/pull/2848)


!SLIDE left
## wild`^W`whitebox

``` text/x-scala
import reflect.macros._, scala.util.Random
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

!SLIDE left
## IDE friendliness
- for auto complete, IDE must run whitebox macro in target
- Scala IDE for Eclipse does this, sees expanded code
- friendly macro [detects IDE](https://github.com/scala/async/blob/master/src/main/scala/scala/async/internal/AsyncBase.scala#L48), reports errors, doesn't expand
- we're working on supporting this in the macro api/tools

!SLIDE left
# Applications
## Code Generation

  - faster code: [foreach](https://github.com/ochafik/Scalaxy/blob/master/Loops/src/main/scala/scalaxy/loops.scala), [specialized](http://lampwww.epfl.ch/~hmiller/scala2013/resources/pdfs/paper10.pdf), [fast || colls](https://github.com/scala-blitz/scala-blitz/tree/master/src/main/scala/scala/collection/par/workstealing/internal)
  - ~~boilerplate~~: [quasi-quotes](https://github.com/scala/scala/blob/master/src/compiler/scala/tools/reflect/quasiquotes/Quasiquotes.scala#L45), [play's json inception](https://github.com/playframework/playframework/blob/master/framework/src/play-json/src/main/scala/play/api/libs/json/JsMacroImpl.scala), [pickling](https://github.com/scala/pickling/blob/2.10.x/core/src/main/scala/pickling/Macros.scala),[source location](https://github.com/scala/scala/blob/master/test/files/run/macro-sip19-revised/Impls_Macros_1.scala)
  - tracing / testing: [expecty](https://github.com/pniederw/expecty/blob/master/src/main/scala/org/expecty/RecorderMacro.scala), [specs2](https://github.com/etorreborre/specs2/blob/master/matcher-extra/src/main/scala/org/specs2/matcher/MatcherMacros.scala), [scalatest](https://github.com/scalatest/scalatest/blob/master/src/main/scala/org/scalatest/AssertionsMacro.scala)

!SLIDE left
# Applications
## Static Checks

  - [spores](https://github.com/heathermiller/spores/blob/master/src/main/scala/scala/spores/package.scala): closure doesn't capture (accidentally)
  - [`printf` string interpolator](https://github.com/scala/scala/blob/master/src/compiler/scala/tools/reflect/MacroImplementations.scala#L14)

!SLIDE left
# Applications
## DSLs

  - SBT: `settings ( x.value )`
  - async: `async { await(x) }`
  - language virtualization


!SLIDE left
# Pro Tips
- use quasi-quotes
- mind your hygiene<br>(name's not as unique as you think, symbol is)
- prototype using `:power` and runtime reflection
- avoid `resetAttr`, combine typed trees<br>(improving this = research)
- unit test [using toolbox compiler](https://github.com/scala/scala-continuations/blob/master/library/src/test/scala/scala/tools/selectivecps/CompilerErrors.scala#L227)

!SLIDE left
# Run-time Reflection

``` text/x-scala
import reflect.runtime.universe._, scala.tools.reflect._

val tree = q"println(1)"
val id = show(tree)
val raw = showRaw(tree)

val toolbox = reflect.runtime.currentMirror.mkToolBox()
toolbox.eval(tree)
```

!SLIDE
#bigger example TODO
##bundle syntax
``` text/x-scala
import reflect.macros._
trait Macros extends BlackboxMacro {
  import c.universe._
  def fooMeta(): Tree = q"{}"
}
```

!SLIDE
## Scala 2.11
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
## last milestone: mid-January
## RC: mid-February

!SLIDE
# Thanks!

# Questions!

