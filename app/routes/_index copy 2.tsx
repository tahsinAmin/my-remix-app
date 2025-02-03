import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";

import { client } from "../lib/graphql-client";
import { gql } from "graphql-request";
import { useState } from "react";

const GetAllCountries = gql`
  {
    countries {
      name
      capital
      currency
    }
  }
`;

export let loader = async () => {
  const { countries } = await client.request(GetAllCountries);

  return json({ countries });
}

export default function Index() {
  const { countries } = useLoaderData();
  const [list, setList] = useState(countries); 
  const [openModal, setOpenModal] = useState(false);
  const fetcher = useFetcher();

  const handleButtonClick = async () => {
    setOpenModal(true)
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Remix + GraphQL
        </h1>

        <button onClick={handleButtonClick}>Fetch Data</button>

        {openModal ? (
          <div>
            {list.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        {item.name}
                        </div>
            ))}
          </div>
        ) : ""}
      </div>
    </div>
  );
}