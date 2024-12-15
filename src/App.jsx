import React, { useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { p } from "framer-motion/client";

const API_URL = "http://localhost:5176/redmine/issues.json"; // Proxy URL
const API_KEY = "02c64529ceafc7184deaabd1046128837967f1b6";

export default function App() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formRef = useRef(null);

  const createIssue = async (data) => {
    const payload = {
      subject: data.Asunto, // Map to Redmine's expected structure
      description: data.Descripción,
      project_id: 3, // Example project ID
      tracker_id: 3, // Example tracker ID
      status_id: 1, // Example status ID
      priority_id: 2, // Example priority ID
    };

    try {
      const response = await axios.post(
        API_URL,
        { issue: payload },
        {
          headers: {
            "X-Redmine-API-Key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Issue created:", response.data);
      alert("Issue created successfully!");
    } catch (error) {
      console.error("Error creating issue:", error.response?.data || error.message);
      alert("Failed to create issue. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert("Please fill out both fields.");
      return;
    }

    const data = { Asunto: subject, Descripción: description };
    setFormData(data);
    await createIssue(data);
    onOpen();
  };

  const handleReset = () => {
    formRef.current.reset();
    setSubject("");
    setDescription("");
    setFormData(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "3rem" }}>
        <h1>
          <strong>Sistema de Gestión de Tickets - GTI</strong>
        </h1>
      </div>
      <Form
        ref={formRef}
        className="w-full max-w-xs flex flex-col gap-4"
        validationBehavior="native"
        onReset={handleReset}
        onSubmit={handleSubmit}
      >
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          isRequired
          errorMessage="Ingrese un Asunto Válido"
          label="Asunto"
          labelPlacement="outside"
          name="Asunto"
          placeholder="Ingrese un Asunto"
          type="text"
        />

        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          errorMessage="Ingrese una Descripción Válida"
          label="Descripción"
          labelPlacement="outside"
          name="Descripción"
          placeholder="Ingrese una Descripción"
          type="text"
        />

        <div className="flex gap-2" style={{ marginTop: "1rem" }}>
          <Button color="primary" type="submit">
            Registrar Ticket
          </Button>
          <Button type="reset" variant="flat">
            Vaciar
          </Button>
        </div>
      </Form>

      {formData && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Ticket Information
                </ModalHeader>
                <ModalBody>
                  {Object.entries(formData).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key.replace(/_/g, " ")}: </strong>
                      {value}
                    </p>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      onOpenChange(false);
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
