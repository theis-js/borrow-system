import "./App.css";
import Layout from "./layout/Layout";
import { useEffect } from "react";
import Form1 from "./components/Form1";
import Form2 from "./components/Form2";
import Form3 from "./components/Form3";

function App() {
  const Items = [
    {
      id: 1,
      title: "Mock Book 1",
      author: "Author 1",
      description: "Description for Mock Book 1",
    },
    {
      id: 2,
      title: "Mock Book 2",
      author: "Author 2",
      description: "Description for Mock Book 2",
    },
    {
      id: 3,
      title: "Mock Book 3",
      author: "Author 3",
      description: "Description for Mock Book 3",
    },
  ];

  useEffect(() => {
    localStorage.setItem("allItems", JSON.stringify(Items));
    localStorage.setItem("borrowableItems", JSON.stringify(Items));
    localStorage.setItem("borrowCode", "123456");
  }, []);

  return (
    <Layout>
      {/* Mock flow without real logic: show the three sections stacked for design preview */}
      <div className="space-y-10">
        <Form1 />
        <div className="h-px bg-blue-100" />
        <Form2 />
        <div className="h-px bg-blue-100" />
        <Form3 />
      </div>
    </Layout>
  );
}

export default App;
