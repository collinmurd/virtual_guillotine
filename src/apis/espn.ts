
export async function getNFLScoreboard() {
  // TODO: handle error
  const resp = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
  );

  return await resp.json();
}