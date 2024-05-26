import { createContext, useState } from "react";
import run from "../config/gemini";
import Showdown from "showdown";
export const Context = createContext();

// eslint-disable-next-line react/prop-types
const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (idx, nexword) => {
    setTimeout(() => {
      setResultData((prev) => prev + nexword);
    }, 75 * idx);
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }
    const converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true,
      openLinksInNewWindow: true,
      emoji: true,
    });
    const html = converter.makeHtml(response);
    let htmlArray = html.split(" ");
    for (let i = 0; i < htmlArray.length; i++) {
      delayPara(i, htmlArray[i] + " ");
    }
    //setResultData(html);
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    input,
    setInput,
    setShowResult,
    newChat,
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
export default ContextProvider;
