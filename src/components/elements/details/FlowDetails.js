import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import FormHeader from "../misc/FormHeader";
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import Rows from "../misc/Rows";
import { IoGitNetworkSharp } from "@react-icons/all-files/io5/IoGitNetworkSharp";
import { request } from "../../../remote_api/uql_api_endpoint";
import RuleRow from "../lists/rows/RuleRow";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import { useConfirm } from "material-ui-confirm";
import urlPrefix from "../../../misc/UrlPrefix";
import { useHistory } from "react-router-dom";
import FlowForm from "../forms/FlowForm";
import FormDrawer from "../drawers/FormDrawer";
import { VscTrash } from "@react-icons/all-files/vsc/VscTrash";
import { VscEdit } from "@react-icons/all-files/vsc/VscEdit";

export default function FlowDetails({ id, onDeleteComplete }) {
  const history = useHistory();

  const [rules, setRules] = React.useState([]);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [displayEdit, setDisplayEdit] = React.useState(false);

  const confirm = useConfirm();

  useEffect(() => {
    setLoading(true);
    request(
      {
        url: "/flow/" + id,
        method: "get",
      },
      setLoading,
      () => {},
      (result) => {
        setData(result.data);
      }
    );
  }, [id]);

  useEffect(() => {
    request(
      {
        url: "/rules/by_flow/" + id,
      },
      () => {
        setRules([]);
      },
      () => {},
      (response) => {
        if (response) {
          setRules(response.data);
        }
      }
    );
  }, [id]);

  const onEditClick = () => {
    if (data) {
      setDisplayEdit(true);
    }
  };

  const onEditComplete = (flowData) => {
    setData(flowData);
    setDisplayEdit(false);
  };

  const onGoToEditFlow = (id) => {
    history.push(urlPrefix("/setup/flow/edit/") + id);
  };

  const onGoToDeployedFlow = (id) => {
    history.push(urlPrefix("/setup/flow/") + id);
  };

  const onDelete = () => {
    confirm({
      title: "Do you want to delete this flow?",
      description: "This action can not be undone.",
    })
      .then(() => {
        request(
          {
            url: "/flow/" + id,
            method: "delete",
          },
          () => {},
          () => {},
          (result) => {
            if (result !== false) {
              request(
                {
                  url: "/flow/metadata/refresh",
                },
                () => {},
                () => {},
                () => {
                  if (onDeleteComplete) {
                    onDeleteComplete(data.id);
                  }
                }
              );
            }
          }
        );
      })
      .catch(() => {});
  };

  const RulesList = ({ rules }) => {
    return rules.map((rule, index) => {
      return <RuleRow data={rule} key={index} />;
    });
  };

  const Details = () => (
    <>
      <FormHeader>Flow</FormHeader>
      <ElevatedBox>
        <FormSubHeader>Data</FormSubHeader>
        <Properties
          properties={data}
          show={["id", "name", "description", "enabled"]}
        />
        <Rows style={{ marginTop: 20 }}>
          <Button
            onClick={onEditClick}
            icon={<VscEdit size={20} />}
            label="Edit"
            disabled={typeof data === "undefined"}
          />
          <Button
            onClick={() => onGoToEditFlow(data.id)}
            icon={<IoGitNetworkSharp size={20} style={{ marginRight: 5 }} />}
            label="Edit FLOW"
            disabled={typeof data === "undefined"}
          />
          <Button
            onClick={() => onGoToDeployedFlow(data.id)}
            icon={<IoGitNetworkSharp size={20} style={{ marginRight: 5 }} />}
            label="View Deployed FLOW"
            disabled={typeof data === "undefined"}
          />
          {onDeleteComplete && (
            <Button
              icon={<VscTrash size={20} />}
              onClick={onDelete}
              label="Delete"
              disabled={typeof data === "undefined"}
            />
          )}
        </Rows>
      </ElevatedBox>

      {Array.isArray(rules) && rules.length > 0 && (
        <>
          <FormHeader>Active Rules</FormHeader>

          <ElevatedBox>
            <FormSubHeader>Rules that trigger this flow</FormSubHeader>
            <RulesList rules={rules} />
          </ElevatedBox>
        </>
      )}
    </>
  );

  return (
    <div className="Box10">
      {loading && <CenteredCircularProgress />}
      {data && <Details />}
      <FormDrawer
        width={800}
        label="Edit Flow"
        onClose={() => {
          setDisplayEdit(false);
        }}
        open={displayEdit}
      >
        {displayEdit && (
          <FlowForm
            onFlowSaveComplete={onEditComplete}
            id={data.id}
            name={data.name}
            description={data.description}
            enabled={data.enabled}
            projects={data.projects}
          />
        )}
      </FormDrawer>
    </div>
  );
}

FlowDetails.propTypes = {
  id: PropTypes.string,
  onDeleteComplete: PropTypes.func,
};
