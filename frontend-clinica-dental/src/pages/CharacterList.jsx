import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';

export default function CharacterList({ characters, loading }) {
  if (loading) return <CircularProgress sx={{ margin: 4 }} />;

  return (
    <Grid container spacing={2}>
      {characters.map(char => (
        <Grid item xs={12} sm={6} md={4} key={char.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{char.name}</Typography>
              <img src={char.image} alt={char.name} width="100%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
