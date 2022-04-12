import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ENDPOINT = "http://localhost:5000";

export const ClientComponent = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    // const socket = socketIOClient(ENDPOINT);
    // socket.on("startBiding", data => {
    //   toast.info(data, { position: toast.POSITION.TOP_CENTER, autoClose: 5000 })
    //   console.log('data======> ', data)
    //   setResponse(data);
    // });
  }, []);

  return (
      <>  
        {/* <button className="btn btn-dark" onClick={connectSocket}>Test Socket</button> */}
        {/* {toast.info(response, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true, autoClose: 5000 })} */}
        <p>
            {response}
        {/* It's <time dateTime={response}>{response}</time> */}
        </p>
      </>
  );
}