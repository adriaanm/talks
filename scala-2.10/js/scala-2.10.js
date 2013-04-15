$(document).ready(function() {
  CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: false,
    matchBrackets: true,
    mode: "text/x-scala"
  })
});
