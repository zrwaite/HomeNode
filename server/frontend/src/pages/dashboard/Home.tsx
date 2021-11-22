import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import ChartsGroup from "../../components/dashboard/ChartsGroup";

function Home() {
  const toast = useToast();
  useEffect(() => {
    setTimeout(function () {
      toast({
        title: "Dashboard Loaded Successfully!",
        description: "Loading graphs...",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      setTimeout(function () {
        toast({
          title: "Graphs Loaded Successfully!",
          description: "Welcome to HomeNode!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }, 1500);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <ChartsGroup />
    </div>
  );
}

export default Home;
