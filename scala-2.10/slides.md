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


!SLIDE
# To be continued


!SLIDE left
# Scala 2.10 highlights

  * String Interpolation ([SIP-11](https://docs.google.com/document/d/1NdxNxZYodPA-c4MLr33KzwzKFkzm9iW9POexT9PkJsU/edit?hl=en_US))
  * Rewritten Pattern Matcher
  * Value Classes ([SIP-15](https://docs.google.com/document/d/10TQKgMiJTbVtkdRG53wsLYwWM2MkhtmdV25-NZvLLMA/edit?hl=en_US))
  * Implicit Classes ([SIP-13](http://docs.scala-lang.org/sips/pending/implicit-classes.html))

!SLIDE left
# Scala 2.10 highlights

  * Feature Imports ([SIP-18](https://docs.google.com/document/d/1nlkvpoIRkx7at1qJEZafJwthZ3GeIklTFhqmXMvTX9Q/edit))
  * Futures and Promises ([SIP-14](http://docs.scala-lang.org/sips/pending/futures-promises.html))
  * Reflection (experimental, [overview](http://docs.scala-lang.org/overviews/reflection/overview.html))
  * Macros (experimental, [SIP-16](http://docs.scala-lang.org/overviews/macros/overview.html))
  * trait Dynamic ([SIP-17](https://docs.google.com/document/d/1XaNgZ06AR7bXJA9-jHrAiBVUwqReqG4-av6beoLaf3U/edit))
  * Dependent method types (cake factory methods)
  * ASM-based back-end <!-- (faster, adds basic 1.6/1.7 support) -->



!SLIDE left
# Pattern matcher

  * Rewritten from scratch
  * Dozen long-standing bugs fixed
    * Favorite: [exponential-space bytecode](https://issues.scala-lang.org/browse/SI-1133)
    * Total: [close to 100](https://issues.scala-lang.org/sr/jira.issueviews:searchrequest-printable/12201/SearchRequest-12201.html?tempMax=1000)


!SLIDE left
# Pattern matcher
## New and improved

  * Error messages: SAT
  * Virtualized: e.g., in the [probability monad](https://github.com/namin/scala/blob/topic-virt-patmat-2.10.0/test/files/run/virtpatmat_problang3.scala)


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


!SLIDE
# Scala = Unifier
## 

``` text/x-scala
implicit class RContext(sc: StringContext) {
  def r = new Regex(
    sc.parts.mkString(""), 
    sc.parts.tail.map(_ => "x"): _*
  )
}

object I { def unapply(x: String) = Try { x.toInt } toOption }

case Array(r"""complete@(\d*)${I(pos)}""", source) =>
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

# Some sample code


!NOTES

 * a note

!SLIDE

