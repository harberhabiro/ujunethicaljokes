import Banner from '../../components/account/Banner';
import Changes from '../../components/profile/Changes';
import ChangeBio from '../../components/profile/ChangeBio';

const update = () => {
    return (
        <>
        <Banner name="Update Profile" />
        <Changes />
        <ChangeBio />
        </>
    )
}

export default update;