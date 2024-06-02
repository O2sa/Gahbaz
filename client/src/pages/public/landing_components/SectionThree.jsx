import { Grid, Text, Container, Title, Image, Button } from '@mantine/core';
import bicyleImg from '../../../assets/images/landing_imgs/lime-bicycle-riding.png'
const SectionThree = () => {
    //const theme = useMantineTheme();

    return (
        <section id="section-three">
            <Container>
                <Grid justify="space-around">
                    <Grid.Col xs={6} sm={4} md={4} lg={4}>
                        <Image src={'https://o2sa.github.io/assets/img/projects_imgs/elearning/img3.png'} alt={'sample2'} style={{ width: '100%' }} />
                    </Grid.Col>
                    <Grid.Col xs={6} sm={8} md={8} lg={8}>
                        <div style={{ marginBottom: 20 }}>
                            <Text color="black">
                                <Title order={1}>واجهات جذابة وسهلة!</Title>
                              يتميز النظام بواجهات سهلة ومرنة تراعي تفضيلات المستخدم واحتياجاته.  </Text>
                        </div>
                        <Button >معرفة المزيد</Button>
                    </Grid.Col>
                </Grid>
            </Container>
        </section>
    );

};

export default SectionThree;