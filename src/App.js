import './App.css';
import awsExports from "./aws-exports";
import {Amplify} from "aws-amplify";
import ClipBoard from "./ClipBoard";

Amplify.configure(awsExports);

if (process.env.REACT_APP_ENV === 'production') {
  global.consoleDebug = console.debug;
  console.debug = function () {
    global.consoleDebug("Console debug is disabled in production");
  }
}


function App() {
  return (
    <ClipBoard />
  );
}

export default App;
