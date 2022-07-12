import './App.css';
import awsExports from "./aws-exports";
import {Amplify} from "aws-amplify";
import ClipBoard from "./ClipBoard";

Amplify.configure(awsExports);

function App() {
  return (
    <ClipBoard />
  );
}

export default App;
