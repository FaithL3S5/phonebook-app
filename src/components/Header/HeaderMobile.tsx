import React, { useState } from "react";
import {
  Flex,
  Text,
  IconButton,
  Input,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Image,
  Box,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface HeaderMobileProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  showAddContact: boolean;
  onPlusIconClick: () => void;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  searchValue,
  setSearchValue,
  showAddContact,
  onPlusIconClick,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <Flex
      as="header"
      width="100%"
      padding="1rem"
      mt={showAddContact ? "5px" : 0}
      alignItems="center"
      boxShadow="md"
    >
      <Text fontSize="xl" fontWeight="bold">
        {showAddContact ? "Add Contact" : "Phone"}
      </Text>
      <Spacer />
      {!showAddContact && (
        <>
          <IconButton
            aria-label="Add"
            bg="black"
            icon={<AddIcon />}
            isRound={true}
            marginRight="1rem"
            color="white"
            _active={{ bgColor: "gray.700" }}
            onClick={onPlusIconClick}
          />
          <Popover
            key={isSearchOpen ? "open" : "closed"}
            isOpen={isSearchOpen}
            onClose={() => {
              setIsSearchOpen(false);
              setSearchValue(""); // Reset the search value when the Popover is closed
            }}
          >
            <PopoverTrigger>
              <IconButton
                aria-label="Search"
                bg="black"
                icon={<SearchIcon />}
                isRound={true}
                marginRight="1rem"
                color="white"
                _active={{ bgColor: "gray.700" }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </PopoverTrigger>
            {isSearchOpen && (
              <PopoverContent
                borderRadius="3xl"
                bgColor="gray.900"
                color="white"
              >
                <PopoverArrow />
                <PopoverBody>
                  <Input
                    placeholder="Search contacts..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    borderRadius="3xl"
                  />
                </PopoverBody>
              </PopoverContent>
            )}
          </Popover>

          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Options"
                bg="black"
                icon={<MoreVertIcon />}
                isRound={true}
                color="white"
                _active={{ bgColor: "gray.700" }}
              />
            </PopoverTrigger>
            <PopoverContent
              borderRadius="3xl"
              bgColor="gray.900"
              width="175px"
              cursor="pointer"
              onClick={() => {
                window.open("https://faith-personal-web.vercel.app", "_blank");
              }}
            >
              <PopoverArrow />
              <PopoverBody>
                <Flex alignItems="center">
                  <Image
                    borderRadius="full"
                    boxSize="40px"
                    src="/assets/images/logo.png"
                    alt="Web Developer"
                    marginRight="1rem"
                  />
                  <Box>
                    <Text>Build by </Text>
                    <Text textDecor="underline">
                      <strong>Faith&#95;L3S5</strong>
                    </Text>
                  </Box>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      )}
    </Flex>
  );
};

export default HeaderMobile;
