import React, { useState } from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { Context as ServerBackupContext } from '@/api/swr/getServerBackups';
import Select from '@/components/elements/Select';
import Label from '@/components/elements/Label';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import useSWR from 'swr'

const fetcher = (url: string): Promise<any> => {
    return fetch(url).then(res => res.json());
}
  
const BackupContainer = () => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const [selected, setSelected] = useState('latest');
    
    const handleChange = (evt) => {
        setSelected(evt.currentTarget.value);
    }

    const { data: versions } = useSWR('https://backups-api.kiwatech.net/', fetcher);
    const { data: folder } = useSWR(`https://backups-api.kiwatech.net/${encodeURIComponent(selected)}/${uuid}/`, fetcher);

    return (
        <ServerContentBlock title={'Backups'}>
            <FlashMessageRender byKey={'backups'} css={tw`mb-4`} />
            <div css={tw`md:flex`}>
                <div css={tw`w-full md:flex-1 md:mr-10`}>
                    <TitledGreyBox title={'Restore a backup'} css={tw`mb-6 md:mb-10`}>
                        <div>
                            <Label>Versions</Label>
                            <Select onChange={handleChange}>
                                {
                                    (!versions) ? 'loading' : versions.map(i => {
                                        return <option value={i}>{new Date(i).toLocaleDateString()}</option>
                                    })
                                }
                            </Select>
                        </div>
                        <div css={tw`mt-6`}>
                            <Label>Files</Label>
                            {(!folder) ? 'loading' : JSON.stringify(folder)}
                        </div>
                    </TitledGreyBox>
                </div>
            </div>
        </ServerContentBlock>
    );
};

export default () => {
    const [ page, setPage ] = useState<number>(1);
    return (
        <ServerBackupContext.Provider value={{ page, setPage }}>
            <BackupContainer/>
        </ServerBackupContext.Provider>
    );
};
