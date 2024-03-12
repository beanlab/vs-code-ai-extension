import React, { useState } from "react";
import { ModelProvider, Persona, PersonaDraft } from "../../../../shared/types";
import { STANDARD_PERSONAS } from "../../../../shared/data/StandardPersonas";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useAppContext } from "../../utilities/AppContext";
import { EditPersona } from "./EditPersona";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";
import NavBar from "../NavBar";

export const PersonaSettings: React.FC = () => {
  const { personaList } = useAppContext();
  const { deletePersona, updatePersona, setDefaultPersonaId } =
    useExtensionMessageContext();
  const { defaultPersonaId } = useAppContext();
  const [selectedPersona, setSelectedPersona] = useState<
    Persona | PersonaDraft | null
  >(null);
  const uneditablePersonaIds = STANDARD_PERSONAS.map((p) => p.id);

  const handleAddPersona = () => {
    setSelectedPersona({
      name: "",
      description: "",
      modelProvider: ModelProvider.OpenAI, // TODO: Default? Leave null?
      modelId: "",
      instructions: "",
    } as PersonaDraft);
  };

  const handleEditPersona = (persona: Persona) => {
    setSelectedPersona(persona as PersonaDraft);
  };

  const handleDeletePersona = (persona: Persona) => {
    deletePersona(persona.id);
  };

  const handleSavePersona = (persona: Persona | PersonaDraft) => {
    updatePersona(persona);
    setSelectedPersona(null);
  };

  const handleDuplicatePersona = (persona: Persona) => {
    const duplicate: PersonaDraft = {
      name: `${persona.name} (copy)`,
      description: persona.description,
      instructions: persona.instructions,
      modelProvider: persona.modelProvider,
      modelId: persona.modelId,
    };
    updatePersona(duplicate);
  };

  return (
    <div>
      {selectedPersona ? (
        <>
          <div className="page-header">
            <h2>Custom Persona</h2>
          </div>
          <EditPersona
            persona={selectedPersona}
            onSave={handleSavePersona}
            onCancel={() => setSelectedPersona(null)}
          />
        </>
      ) : (
        <>
          <NavBar />
          <div className="page-header">
            <h2>Personas</h2>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <VSCodeButton
              onClick={handleAddPersona}
              appearance="primary"
              title="Add"
              aria-label="Add"
            >
              Create Persona
              <span slot="start" className="codicon codicon-add"></span>
            </VSCodeButton>
          </div>

          <div className="persona-cards">
            {personaList.map((persona) => (
              <div key={persona.modelId} className="persona-card">
                <div className="persona-card-header">
                  <div className="persona-card-button-group">
                    <h3>{persona.name}</h3>
                    {persona.id === defaultPersonaId ? (
                      <i
                        title="Default persona for new chats"
                        className="codicon codicon-star-full"
                        style={{ padding: "var(--button-icon-padding)" }}
                      ></i>
                    ) : (
                      <VSCodeButton
                        title="Set as default persona for new chats"
                        aria-label="Set as default persona for new chats"
                        appearance="icon"
                        onClick={() => setDefaultPersonaId(persona.id)}
                      >
                        <i className="codicon codicon-star-empty"></i>
                      </VSCodeButton>
                    )}
                  </div>
                  <div className="persona-card-button-group">
                    {!uneditablePersonaIds.includes(persona.id) && (
                      <VSCodeButton
                        onClick={() => handleEditPersona(persona)}
                        title="Edit"
                        aria-label="Edit"
                        appearance="icon"
                      >
                        <i className="codicon codicon-edit" />
                      </VSCodeButton>
                    )}
                    <VSCodeButton
                      onClick={() => handleDuplicatePersona(persona)}
                      title="Duplicate"
                      aria-label="Duplicate"
                      appearance="icon"
                    >
                      <i className="codicon codicon-copy" />
                    </VSCodeButton>
                    {!uneditablePersonaIds.includes(persona.id) && (
                      <VSCodeButton
                        onClick={() => handleDeletePersona(persona)}
                        title="Delete"
                        aria-label="Delete"
                        appearance="icon"
                      >
                        <i className="codicon codicon-trash" />
                      </VSCodeButton>
                    )}
                  </div>
                </div>
                <p>{persona.description}</p>
                <hr />
                <p>
                  {persona.modelProvider}: {persona.modelId}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
