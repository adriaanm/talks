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
## Simple.

!SLIDE
# Scala
## I'm serious.

!SLIDE
# Scala
## I'll be convincing.

!SLIDE
# Scala = Unifier

  * Functions (Small abstractions.)
  * Objects and traits (Big abstractions.)


!SLIDE
# Scala = Unifier

  * Experimentation
  * Large-scala`^H`e development

!SLIDE
# Experimenting
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
    case Array(rx"""complete@(\d*)${I(pos)}""", source) =>
      // handle completion at position $pos
  }
}
```

!SLIDE
# Scala = Unifier
## 

``` text/x-scala
implicit class RContext(sc: StringContext) {
  def rx = new Regex(
    sc.parts.mkString(""), 
    sc.parts.tail.map(_ => "x"): _*
  )
}

object I { def unapply(x: String) = Try { x.toInt } toOption }

case Array(rx"""complete@(\d*)${I(pos)}""", source) =>
```

!NOTES
this is the unifier of the talk
implicit classes
value classes
string interpolators
patmat & objects
macros (printf-style validation)
 
 
 
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

