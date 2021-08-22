import React, { useEffect, useState } from "react";

import {
  Dropdown,
  Form,
  Header,
  // Pagination,
  // Menu,
  Table,
} from "semantic-ui-react";

function Part1() {
  const [agentsList, setAgentsList] = useState([]);
  const [durationRange, setDurationRange] = useState([]);
  const [agents, setAgents] = useState([]);
  const [formdata, setFormData] = useState({
    minrange: 0,
    maxrange: 0,
  });
  const [tabledata, setTableData] = useState([]);
  useEffect(() => {
    const call = async () => {
      let response1 = await fetch(
        "https://damp-garden-93707.herokuapp.com/getlistofagents"
      );
      response1 = await response1.json();
      let response2 = await fetch(
        "https://damp-garden-93707.herokuapp.com/getdurationrange"
      );
      response2 = await response2.json();
      response1 = response1.data.listofagents;
      response2 = response2.data;
      setAgentsList(
        response1.map((agent, index) => ({
          key: index,
          text: agent,
          value: agent.toLowerCase(),
        }))
      );
      setDurationRange(response2);
    };
    call();
  }, []);

  const handlechange = (e) => {
    if (e.target.value) {
      setFormData({
        ...formdata,
        [e.target.name]: parseFloat(e.target.value),
      });
    } else {
      const val = e.target.textContent;
      if (val !== "") setAgents([...agents, val]);
      else setAgents(agents.slice(0, agents.length - 1));
    }
  };
  const handleSubmit = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      info: {
        filter_agent_list: agents,
        filter_time_range: [formdata.minrange, formdata.maxrange],
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response3 = await fetch(
      "https://damp-garden-93707.herokuapp.com/getfilteredcalls",
      requestOptions
    );
    response3 = await response3.json();
    setTableData(response3.data);
  };

  return (
    <div className="container">
      <Header as="h1">Part 1</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          fluid
          label={`Min Call Duration : ${durationRange.minimum}`}
          placeholder="Min Call Duration"
          onChange={handlechange}
          name="minrange"
          value={formdata.minrange}
        />
        <Form.Input
          fluid
          label={`Max Call Duration : ${durationRange.maximum}`}
          placeholder="Max Call Duration"
          onChange={handlechange}
          name="maxrange"
          value={formdata.maxrange}
        />
        <Header as="h5">Agents List</Header>
        <Dropdown
          placeholder="Agents"
          fluid
          multiple
          search
          selection
          options={agentsList}
          onChange={handlechange}
        />
        <Form.Button>Submit</Form.Button>
      </Form>
      {/* <p>{JSON.stringify(tabledata)}</p> */}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Agent_Id</Table.HeaderCell>
            <Table.HeaderCell>Call_Id</Table.HeaderCell>
            <Table.HeaderCell>Call_Time</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tabledata.map((tdata) => (
            <Table.Row key={tdata.call_id}>
              <Table.Cell>{tdata.agent_id}</Table.Cell>
              <Table.Cell>{tdata.call_id}</Table.Cell>
              <Table.Cell>{tdata.call_time}</Table.Cell>
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

export default Part1;
