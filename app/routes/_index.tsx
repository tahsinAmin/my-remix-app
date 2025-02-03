import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { json } from "@remix-run/node";

import { client } from "../lib/graphql-client";
import { gql } from "graphql-request";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const GetAllCountries = gql`
  {
    countries {
      name
    }
  }
`;

export let loader = async () => {
  const { countries } = await client.request(GetAllCountries);

  return json({ countries });
};

export default function Index() {
  const fetcher = useFetcher();

  const { countries } = useLoaderData();
  console.log("countries =", countries);

  const [list, setList] = useState(countries.map((country) => country.name));

  const [openModal, setOpenModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [collections, setCollections] = useState([
    { name: "Summer", list: ["Product 6", "Product 7", "Product 8"] },
  ]);
  const [inputValue, setInputValue] = useState("");

  const [openCollection, setOpenCollection] = useState(false);
  const [index, setIndex] = useState(null);

  const [collection, setCollection] = useState({});

  const handleCheckboxChange2 = (event, index) => {
    const newSelectedProducts = [...selectedProducts];
    if (event.target.checked) {
      newSelectedProducts.push(collection.list[index]);
    } else {
      const productIndex = newSelectedProducts.indexOf(collection.list[index]);
      if (productIndex !== -1) {
        newSelectedProducts.splice(productIndex, 1);
      }
    }
    setSelectedProducts(newSelectedProducts);
  };
  
  const editCollection = (index) => {
    setIndex(index);
    setOpenCollection(true);
    setCollection(collections[index]);
    setSelectedProducts(collections[index].list);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setSelectedProducts(formData.getAll("my-input"));
    const tags = formData.getAll("my-input");
    const data = Object.fromEntries(formData);

    // Add the new data to the existing array
    // setCollections([...collections, {name: data.name, list: tags}]);

    setCollections([
      ...collections,
      {
        name: data.name,
        list: tags,
      },
    ]);

    const updatedList = list.filter((product) => !tags.includes(product));
    console.log("tags =", tags);
    console.log("updatedList =", updatedList);

    setList(updatedList);

    // Clear the form
    event.target.reset();

    setSelectedProducts([]);
    setInputValue("");
    setOpenModal(!openModal);
  };

  const handleEdit = (event) => {
    event.preventDefault();

        // Remove selected products from the list
    const updatedList = collection.list.filter(
      (product) => !selectedProducts.includes(product)
    );
    
    let newCollections = collections;
    newCollections[index] = {name: collection.name, list: selectedProducts}
    setCollections(newCollections);
    setSelectedProducts([])
    setList([...list, ...updatedList]);
    setIndex(null);
    setOpenCollection(false);
  }

  const deleteCollection = () => {
    setList([...list, ...collections[index].list])
    let newCollections = collections;
    
    newCollections.splice(index, 1);
    setCollections(newCollections);
    setIndex(null);
    setSelectedProducts([])
    setOpenCollection(false);
  }


  const folderControls = () => {
    setIndex(null);
    setOpenCollection(false);
    setOpenModal(!openModal)
  }

  return (
    <div className="">
      <nav className="flex justify-end shadow-xl items-center p-8">
        <button
          className="bg-indigo-500 shadow-lg shadow-indigo-500/50 text-white p-3 rounded-lg"
          onClick={() => folderControls()}
        >
          Create Collection
        </button>
      </nav>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Collection:</h1>

        <div className="flex gap-5">
          {collections.length > 0
            ? collections.map((collection, index) => (
                <div
                  key={index}
                  onClick={() => editCollection(index)}
                  className="block w-64 px-8 py-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-lg-light"
                >
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                    {collection.name}
                  </h3>
                </div>
              ))
            : "No Collection found"}
        </div>

        {openModal && (
          <div className="hsidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full border-gray-200 rounded-lg shadow-sm bg-gray-600">
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    New Collection
                  </h3>
                  <button
                    type="button"
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="authentication-modal"
                    onClick={() => setOpenModal(!openModal)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-4 md:p-5">
                  <Form
                    method="post"
                    onSubmit={handleSubmit}
                    className="space-y-6 mt-6"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="h-48 overflow-auto">
                      {list.map((item, index) => (
                        <div key={index} className="">
                          <input type="checkbox" name="my-input" value={item} />
                          <label>{item}</label>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Save
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )}
        {openCollection ? (
          <div>
            <Form className="space-y-4" 
             method="post"
            onSubmit={handleEdit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        value={collection.name}
                        onChange={(e) => setCollection({...collection, name: e.target.value})}
                        name="name"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Title"
                        required
                      />
                    </div>
                    {collection.list.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="remember"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                              checked={selectedProducts.includes(item)}
                              onChange={(event) => handleCheckboxChange2(event, index)}
                            />
                          </div>
                          <label
                            htmlFor="remember"
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {item}
                          </label>
                        </div>
                      </div>
                    ))}
                    <div className="flex">
                    <button
                    onClick={() => deleteCollection()}
                      
                      className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Delete
                    </button>
                    <button
                      type="submit"
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Update
                    </button>
                    </div>
                  </Form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}