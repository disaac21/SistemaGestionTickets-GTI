import React from "react";
import { Form, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import axios from "axios";

const API_URL = 'http://172.19.124.252/redmine/issues.json';
const API_KEY = '02c64529ceafc7184deaabd1046128837967f1b6'; // Your API Key

export default function App() {
  const [formData, setFormData] = React.useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const createIssue = async (data) => {
    try {
      const response = await axios.post(
        API_URL,
        { issue: data },
        {
          headers: {
            'X-Redmine-API-Key': API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Issue created:", response.data);
      alert("Issue created successfully!");
    } catch (error) {
      console.error("Error creating issue:", error.response ? error.response.data : error.message);
      alert("Failed to create issue. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data); // Log the created object
    setFormData(data);
    await createIssue(data); // Call the createIssue function
    onOpen();
  };

  const handleReset = () => {
    setFormData(null);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        validationBehavior="native"
        onReset={handleReset}
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          errorMessage="Please enter a valid Subject"
          label="Subject"
          labelPlacement="outside"
          name="subject"
          placeholder="Enter the Subject"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Please enter a valid Description"
          label="Description"
          labelPlacement="outside"
          name="description"
          placeholder="Enter the Description"
          type="text"
        />

        <div className="flex gap-2">
          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button type="reset" variant="flat">
            Reset
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
                  <Button color="danger" variant="light" onPress={onClose}>
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
