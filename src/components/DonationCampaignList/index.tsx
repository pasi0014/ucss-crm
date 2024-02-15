import React from 'react';
import { IColumnProps } from '../../interfaces';
import { Box } from '@chakra-ui/react';
import DataTable from '../DataTable';
import { Badge } from '@chakra-ui/react';
import { getStatus, getStatusColor } from '../../utils/utilities';


interface DonationCampaignListProps {
    statuses?: any;
    donationCampaigns: any[];
    onOpen: (val: any) => void;
}

const DonationCampaignList: React.FC<DonationCampaignListProps> = ({ statuses, donationCampaigns, onOpen }) => {

    const columns: IColumnProps[] = [
        { header: 'Name', accessor: 'nameEn', render: (value) => <span>{value}</span> },
        {
            header: 'StatusId', accessor: 'StatusId', render: (value) => <Badge
                colorScheme={getStatusColor(
                    getStatus(statuses.DonationCampaign, value).tag || '',
                )}
            >
                {getStatus(statuses.DonationCampaign, value).tag}
            </Badge>
        },
    ];


    return <Box>
        {donationCampaigns && !!donationCampaigns.length && <DataTable items={donationCampaigns} columns={columns} onOpenRecord={onOpen} />}
    </Box>
}

export default DonationCampaignList;