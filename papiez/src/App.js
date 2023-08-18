import { Highlighted } from "./Highlighted";
function App() {
  return (
    <Highlighted>
      {`
def foo():
   return "bar"
foo()
`}
    </Highlighted>

  );
}

export default App;
