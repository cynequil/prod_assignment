import React, { useEffect, useState } from "react";

import {
  Dropdown,
  Table,
  Header,
  // Pagination,
  // Menu,
  Form,
  Button,
  Modal,
} from "semantic-ui-react";

function Part2() {
  const [key] = useState("34erty2");
  const [trigger, setTrigger] = useState(false);
  const [open, setOpen] = useState(false);
  const [calllist, setCallList] = useState([]);
  const [labelslist, setLablesList] = useState([]);
  const [rowslist, setRowsList] = useState([]);
  const [operationslist] = useState([
    {
      key: "add",
      text: "add",
      value: "add",
    },
    {
      key: "remove",
      text: "remove",
      value: "remove",
    },
  ]);
  const [labels, setLabels] = useState([]);
  const [rows, setRows] = useState([]);
  const [operation, setOperation] = useState("");
  useEffect(() => {
    const call = async (url, api) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("user_id", `${key}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      let response = await fetch(`${url}`, requestOptions);
      response = await response.json();
      if (api === "clist") {
        response = response.data.call_data;
        setCallList(response);
        setRowsList(
          response.map((item) => ({
            key: item.call_id,
            text: item.call_id,
            value: item.call_id,
          }))
        );
      } else {
        response = response.data.unique_label_list;
        setLablesList(
          response.map((label, index) => ({
            key: index,
            text: label,
            value: label.toLowerCase(),
          }))
        );
      }
    };
    call("https://damp-garden-93707.herokuapp.com/getcalllist", "clist");
    call("https://damp-garden-93707.herokuapp.com/getlistoflabels", "labels");
  }, [trigger, key]);

  const handlechange = (e, name) => {
    const val = e.target.textContent;
    if (name === "labels") {
      if (val !== "") setLabels([...labels, val]);
      else setLabels(labels.slice(0, labels.length - 1));
    } else if (name === "rows") {
      if (val !== "") setRows([...rows, val]);
      else setRows(rows.slice(0, rows.length - 1));
    } else {
      setOperation(val);
    }
  };

  const handleSubmit = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("user_id", `${key}`);

    const raw = JSON.stringify({
      operation: {
        callList: rows.map((val) => parseInt(val, 10)),
        label_ops: labels.map((label) => ({
          name: label,
          op: operation,
        })),
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response2 = await fetch(
      "https://damp-garden-93707.herokuapp.com/applyLabels",
      requestOptions
    );
    response2 = await response2.json();
    if (response2.message === "successfull") setTrigger(!trigger);
  };

  const handleclick = () => setRows(calllist.map((item) => item.call_id));
  return (
    <div className="container">
      <Header as="h1">Part 2</Header>
      <Form onSubmit={handleSubmit}>
        <Header as="h5">Labels List</Header>
        <Dropdown
          placeholder="Labels"
          fluid
          multiple
          search
          selection
          options={labelslist}
          onChange={(e) => handlechange(e, "labels")}
        />
        <Header as="h5">Rows List</Header>
        <Dropdown
          placeholder="Select Rows"
          fluid
          multiple
          search
          selection
          options={rowslist}
          onChange={(e) => handlechange(e, "rows")}
        />
        <Header as="h5">Operations</Header>
        <Dropdown
          placeholder="Operations"
          fluid
          search
          selection
          options={operationslist}
          onChange={(e) => handlechange(e, "operation")}
        />
        <Form.Button>Submit</Form.Button>
      </Form>
      <div className="all_rows">
        <Modal
          closeIcon
          open={open}
          trigger={<Button>Select all rows</Button>}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          onClick={handleclick}
        >
          <Header icon="archive" content="Archive Old Messages" />
          <Modal.Content>
            <p>All rows have been selected, please close the pop-up.</p>
          </Modal.Content>
        </Modal>
      </div>
      <Table celled compact definition>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell>Call_Id</Table.HeaderCell>
            <Table.HeaderCell>Label_Id</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {calllist.map((item) => (
            <Table.Row key={item.call_id}>
              <Table.Cell>{item.call_id}</Table.Cell>
              <Table.Cell>{item.label_id}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        {/* <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">
              <Menu floated="right" pagination>
                <Pagination
                  boundaryRange={0}
                  defaultActivePage={1}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={10}
                />
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer> */}
      </Table>
    </div>
  );
}

export default Part2;
