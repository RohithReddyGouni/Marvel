import React, { useEffect } from "react";
import { useParams, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Character from "./Character";
import { Col, Row } from "react-bootstrap";
import ErrorPage from "./ErrorPage";
import CharacterHistory from "./CharacterHistory";

const Characters = () => {
  let { page } = useParams();
  const [characters, setCharacters] = React.useState([]);
  const [totalCharacters, setTotalCharacters] = React.useState(0);
  let charactersPerPage = 20;
  let offset = (page - 1) * charactersPerPage;
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let getData = async () => {
      try {
        const result = await axios.get(`http://localhost:4000/api/characters/page/${page}`, {
          cancelToken: cancelToken.token,
        });
        setCharacters(result.data.data.results);
        setTotalCharacters(result.data.data.total);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (searchTerm.trim() === "") {
      getData();
    }

    return () => {
      cancelToken.cancel();
    };
  }, [page, searchTerm]);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let searchCharacters = async (searchTerm) => {
      try {
        setLoading(true);
        const result = await axios.get(
          `http://localhost:4000/api/characters/search/${searchTerm}?page=${page}`,
          {
            cancelToken: cancelToken.token,
          }
        );
        setCharacters(result.data.data.results);
        setTotalCharacters(result.data.data.total);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        // changePage(0);
        setLoading(false);
      }
    };
    if (searchTerm.trim() !== "") {
      searchCharacters(searchTerm);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [searchTerm, page]);

  return (
    <div>
      {!loading && !error ? (
        <div>
          <h2>Characters</h2>
          <div className="search" style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="text"
                id="characterTerm"
                placeholder="Search for a character"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("searchButton").click();
                  }
                }}
              />
            </label>
            <Link
              to={`/characters/page/${1}`}
              id="searchButton"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setSearchTerm(document.getElementById("characterTerm").value);
              }}
            >
              Search
            </Link>
          </div>

          <Col xs={12} md={12} lg={12}>
            {page !== "1" && (
              <Link
                to={`/characters/page/${parseInt(page) - 1}`}
                className="btn btn-primary btn-sm me-5"
                onClick={() => {
                  setLoading(true);
                }}
              >
                Previous
              </Link>
            )}
            {offset + charactersPerPage < totalCharacters && (
              <Link
                to={`/characters/page/${parseInt(page) + 1}`}
                className="btn btn-primary btn-sm ms-5"
                onClick={() => {
                  setLoading(true);
                }}
              >
                Next
              </Link>
            )}
            <Routes>
              <Route path="/characters/page/:page" element={<Characters />} />
            </Routes>
          </Col>
          <Row>
            <Character className="col-md-4" characters={characters} />
          </Row>
        </div>
      ) : null}
      {loading && !error ? <h1>Loading...</h1> : null}
      {error && !loading ? (
        <>
          <ErrorPage />
          <CharacterHistory />
        </>
      ) : null}
    </div>
  );
};

export default Characters;
