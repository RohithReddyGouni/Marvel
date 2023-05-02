import React, { useEffect, useState } from "react";
import axios from "axios";
import Character from "./Character";
import { Row } from "react-bootstrap";

const CharacterHistory = () => {
  const [characterHistory, setCharacterHistory] = useState([]);
  const url = "http://localhost:4000/api/characters/history";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let getHistory = async () => {
      const response = await axios.get(url, {
        cancelToken: cancelToken.token,
      });
      setCharacterHistory(response.data);
      setLoading(false);
    };
    getHistory();

    return () => {
      cancelToken.cancel();
    };
  }, []);

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <h1>Character History that were recently viewed by the user</h1>
          <Row>
            <Character characters={characterHistory} />
          </Row>
        </div>
      )}
    </>
  );
};

export default CharacterHistory;
