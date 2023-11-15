import React, { useContext, useMemo, useState } from 'react';

import { useColorModeValue, Button, Flex, Heading, Box, Select, useToast } from '@chakra-ui/react';

import MessageBar from '../MessageBar';
import { AppContext } from '../../context/AppContext';
import { getStatus } from '../../utils/utilities';
import { updateCampaignStatus } from './calls';

interface DonationCampaignPublishProps {
    statusId: string;
    statuses: any;
    donationCampaignId?: number;
}

const DonationCampaignPublish: React.FC<DonationCampaignPublishProps> = ({ statusId, statuses, donationCampaignId }) => {
    const toast = useToast();
    const { setAppLoading } = useContext<any>(AppContext);

    const [selectedStatus, setSelectedStatus] = useState<any>(statusId || statuses.DonationCampaign.DRAFT);

    const statusItems = useMemo(
        () =>
            Object.keys(statuses.DonationCampaign).map((statusKey) => ({
                key: statuses.DonationCampaign[statusKey],
                text: getStatus(statuses.DonationCampaign, statuses.DonationCampaign[statusKey]).tag,
            })),
        [],
    );

    const [error, setError] = useState(false);
    const [messageBar, setMessageBar] = useState<any>({});

    const doUpdateStatus = async () => {
        setAppLoading(true);
        setError(false);

        try {
            const response = await updateCampaignStatus(selectedStatus, donationCampaignId);

            if (!response.success) {
                setError(true);
                setMessageBar({
                    type: 'error',
                    message: `Unexpected error while trying to update Event's Status`,
                });
            }

            toast({
                title: 'Success!',
                description: `Donation Campaign status has been updated`,
                position: 'top-right',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
        } catch (error: any) {
            console.error(`Unexpected error while trying to update Donation Campaign's Status`, { error });
            setMessageBar({ type: 'error', message: error.message });
        }
        setAppLoading(false);
    };

    return (
        <>
            <Box>
                <Heading as="h3" size="md" mt={10} mb={5}>
                    Publish the event
                </Heading>
            </Box>
            {error && (
                <Box mb={5}>
                    <MessageBar type={messageBar.type} message={messageBar.message} />
                </Box>
            )}
            <Box>
                <Select
                    placeholder="Select a status"
                    value={selectedStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSelectedStatus(e.target.value);
                    }}
                >
                    {statusItems.map((status: any) => (
                        <option key={status.key} value={status.key}>
                            {status.text}
                        </option>
                    ))}
                </Select>
            </Box>
            <Flex>
                <Button
                    mt={7}
                    _hover={{
                        bg: useColorModeValue('green.400', 'green.500'),
                    }}
                    color={useColorModeValue('white', 'gray.100')}
                    bg={useColorModeValue('green.500', 'green.600')}
                    onClick={doUpdateStatus}
                >
                    Update Status
                </Button>
            </Flex>
        </>
    );
};

export default DonationCampaignPublish;
