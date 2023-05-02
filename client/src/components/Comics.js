import React, { useEffect } from "react";
import { Route, useParams, Routes, Link } from "react-router-dom";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import Comic from "./Comic";
import ErrorPage from "./ErrorPage";

const Comics = () => {
  let { page } = useParams();
  const [comics, setComics] = React.useState([]);
  const [totalComics, setTotalComics] = React.useState(0);
  let comicsPerPage = 20;
  let offset = (page - 1) * comicsPerPage;
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let getdata = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/comics/page/${page}`, {
          cancelToken: cancelToken.token,
        });
        setComics(response.data.data.results);
        setTotalComics(response.data.data.total);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (searchTerm.trim() === "") {
      getdata();
    }

    return () => {
      cancelToken.cancel();
    };
  }, [page, searchTerm]);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let searchComics = async (searchTerm) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/comics/search/${searchTerm}?page=${page}`,
          {
            cancelToken: cancelToken.token,
          }
        );
        setComics(response.data.data.results);
        setTotalComics(response.data.data.total);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (searchTerm.trim() !== "") {
      searchComics(searchTerm);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [searchTerm, page]);

  return (
    <div>
      {!loading && !error ? (
        <>
          <h2>Comics</h2>
          <div className="search" style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="text"
                id="comicTerm"
                placeholder="Search for a comic..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("searchButton").click();
                  }
                }}
              />
            </label>
            <Link
              to={`/comics/page/${1}`}
              id="searchButton"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setSearchTerm(document.getElementById("comicTerm").value);
              }}
            >
              Search
            </Link>
          </div>

          <Col xs={12} md={12} lg={12}>
            {page !== "1" && (
              <Link
                to={`/comics/page/${parseInt(page) - 1}`}
                className="btn btn-primary btn-sm me-5"
                onClick={() => {
                  setLoading(true);
                }}
              >
                Previous
              </Link>
            )}
            {offset + comicsPerPage < totalComics && (
              <Link
                to={`/comics/page/${parseInt(page) + 1}`}
                className="btn btn-primary btn-sm ms-5"
                onClick={() => {
                  setLoading(true);
                }}
              >
                Next
              </Link>
            )}
            <Routes>
              <Route path="/page/:page" element={<Comics />} />
            </Routes>
          </Col>
          <Row>
            <Comic comics={comics} />
          </Row>
        </>
      ) : null}
      {loading && !error ? <h1>Loading...</h1> : null}
      {error && !loading ? <ErrorPage /> : null}
    </div>
  );
};

export default Comics;
