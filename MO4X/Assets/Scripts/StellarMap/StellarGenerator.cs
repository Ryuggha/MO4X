using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StellarGenerator : MonoBehaviour
{
    [SerializeField] private GameObject starPrefab;

    private void Start()
    {
        generateStarMap();
    }

    private void generateStarMap()
    {
        GameResponse game = GameController.instance.getGame();

        foreach (var star in game.stars)
        {
            GameObject o = Instantiate(starPrefab, new Vector2(star.xPos, star.yPos), Quaternion.identity);
            o.transform.parent = transform;
            o.name = star.name;
            o.GetComponent<StarCollider>().setStar(star, true);
        }
    }

    public void back()
    {
        GameController.instance.setStar(null);
        SceneController.instance.changeScene("MainMenu");
    }
}
