import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import ErrorPage from "./ErrorPage";
import Axios from "axios";

const CharacterDetails = () => {
  let { id } = useParams();
  const url = `http://localhost:4000/api/characters/${id}`;
  const [characterData, setCharacterData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    let getCharacter = async () => {
      try {
        const result = await Axios.get(url);
        if (result.data.status === 404) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = result.data;
        setError(false);
        setCharacterData(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    };
    getCharacter();
  }, [url]);

  return (
    <div>
      {!loading && !error ? (
        <>
          <h2>Character Details</h2>
          <Row>
            <Col>
              <h2>{characterData.name}</h2>
              <img
                src={`${characterData.thumbnail.path}.${characterData.thumbnail.extension}`}
                alt={characterData.name}
                height="350"
                width="500"
              />
              <div>
                <h3>Description</h3>
                <p>
                  {characterData.description
                    ? characterData.description
                    : "No description available for this character"}
                </p>
              </div>
            </Col>
            <Col style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Col xs={12} md={6} lg={6}>
                <h3>Comics</h3>
                <ul>
                  {characterData.comics.items.map((comic) => {
                    return (
                      <li className="removeDot mt-2" key={comic.name}>
                        <Link to={`/comics/${comic.resourceURI.split("/").pop()}`}>
                          {comic.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <h3>Stories</h3>
                <ul>
                  {characterData.stories.items.map((story) => {
                    return (
                      <li className="removeDot mt-2" key={story.name}>
                        <Link to={`/stories/${story.resourceURI.split("/").pop()}`}>
                          {story.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Col>
            </Col>
          </Row>
        </>
      ) : null}
      {loading && !error ? <h1>Loading...</h1> : null}
      {error && !loading ? <ErrorPage /> : null}
    </div>
  );
};

export default CharacterDetails;
