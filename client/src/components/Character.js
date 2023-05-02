import React from "react";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";

const Character = ({ characters }) => {
  return (
    <>
      {characters.map((character) => (
        <Col xs={12} md={6} lg={4} className="text-center mt-5" key={character.id}>
          <Link to={"/characters/" + character.id}>
            <div className="border border-dark rounded p-2">
              <h3>{character.name}</h3>
              <img
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                alt={character.name}
                width="350"
                height="250"
              />
            </div>
          </Link>
        </Col>
      ))}
    </>
  );
};

export default Character;
