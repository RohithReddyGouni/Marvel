import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ErrorPage from "./ErrorPage";
import { Col, Row } from "react-bootstrap";
import NotFoundInage from "../image/image-not-found.jpg";

const StoryDetails = () => {
  let { id } = useParams();
  const url = `http://localhost:4000/api/stories/${id}`;
  const [story, setStory] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let getstory = async () => {
      try {
        const response = await axios.get(url, {
          cancelToken: cancelToken.token,
        });
        if (response.data.status === 404) {
          setError(true);
          setLoading(false);
          return;
        }
        setStory(response.data);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    getstory();

    return () => {
      cancelToken.cancel();
    };
  }, [url]);

  return (
    <div>
      {!loading && !error ? (
        <>
          <h2>Story Details</h2>
          <Row>
            <Col xs={12} md={6} lg={6}>
              <h3>{story.title}</h3>
              {story.thumbnail ? (
                <img
                  src={`${story.thumbnail.path}.${story.thumbnail.extension}`}
                  alt={story.title}
                />
              ) : (
                <img src={NotFoundInage} alt={story.title} />
              )}
              <div>
                <h3>Description</h3>
                <p>
                  {story.description
                    ? story.description
                    : "No description available for this story"}
                </p>
              </div>
            </Col>
            <Col style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Col xs={12} md={6} lg={6}>
                <h3>Characters</h3>
                <ul>
                  {story.characters.items.map((character) => (
                    <li className="removeDot mt-2" key={character.name}>
                      <Link to={`/characters/${character.resourceURI.split("/").pop()}`}>
                        {character.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <h3>Comics</h3>
                <ul>
                  {story.comics.items.map((comic) => (
                    <li className="removeDot mt-2" key={comic.name}>
                      <Link to={`/comics/${comic.resourceURI.split("/").pop()}`}>{comic.name}</Link>
                    </li>
                  ))}
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

export default StoryDetails;
