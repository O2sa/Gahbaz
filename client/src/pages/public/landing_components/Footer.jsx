import { useMantineTheme, Container, Grid, Text, Button, Group, Avatar, UnstyledButton, Anchor, Code } from '@mantine/core';

const Footer = () => {
    const theme = useMantineTheme();
    
    return (
        <footer style={{ backgroundColor: theme.colors.brand[5]}}>

            <Container>
                <Grid justify="space-around">

                    <Grid.Col xs={12} sm={8} md={8} lg={8}>
                        
                        <Text size="xl" weight={700} color="white" mb="10px">
                        <Text color='black'>جهبذ</Text>منصة تعلم عن بعد متكاملة                                 </Text>

                     

                        <Text color="white" mb="20px">
                            تواصل معنا: <Anchor color='black' href="jahbaz.contact@jahbz.com">jahbaz.contact@jahbz.com</Anchor>
                        </Text>

                        <Button variant="white" color="black" >مواقع التواصل</Button>
                    </Grid.Col>

                    <Grid.Col xs={12} sm={4} md={4} lg={4}>
                        <Code color="yellow" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 15 }}>
                            قام بتطوير النظام: 
                            <Anchor href="https://github.com/o2sa">
                                <UnstyledButton>
                                    <Group>
                                        {/* <Avatar size={40} color="orange">GDC</Avatar> */}
                                        <div>
                                            <Text>أسامة مبخوت</Text>
                                            <Text size="xs" color="dimmed">osama.f.mabkhot@gmail.com</Text>
                                        </div>
                                    </Group>
                                </UnstyledButton>
                            </Anchor>
                        </Code>
                    </Grid.Col>
                </Grid>
            </Container>
        </footer>
    )
};

export default Footer;

const redirectToLink = (link) => {
    window.open(link, '_blank');
};