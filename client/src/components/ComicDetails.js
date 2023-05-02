import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ErrorPage from "./ErrorPage";
import { Col, Row } from "react-bootstrap";

const ComicDetails = () => {
  let { id } = useParams();
  const url = `http://localhost:4000/api/comics/${id}`;
  const [comic, setComic] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let getcomic = async () => {
      try {
        const response = await axios.get(url, {
          cancelToken: cancelToken.token,
        });
        if (response.data.status === 404) {
          setError(true);
          setLoading(false);
          return;
        }
        setComic(response.data);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    getcomic();

    return () => {
      cancelToken.cancel();
    };
  }, [url]);

  return (
    <div>
      {!loading && !error ? (
        <>
          <h2>Comic Details</h2>
          <Row>
            <Col xs={12} md={6} lg={6}>
              <h2>{comic.title}</h2>
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                height="350"
                width="500"
              />
              <div>
                <h3>Description</h3>
                <p>
                  {comic.description
                    ? comic.description
                    : "No description available for this comic"}
                </p>
              </div>
            </Col>
            <Col style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Col xs={12} md={6} lg={6}>
                <h3>Characters</h3>
                <ul>
                  {comic.characters.items.map((character) => (
                    <li className="removeDot mt-2" key={character.name}>
                      <Link to={`/characters/${character.resourceURI.split("/").pop()}`}>
                        {character.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <h3>Stories</h3>
                <ul>
                  {comic.stories.items.map((story) => (
                    <li className="removeDot mt-2" key={story.name}>
                      <Link to={`/stories/${story.resourceURI.split("/").pop()}`}>
                        {story.name}
                      </Link>
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

export default ComicDetails;
