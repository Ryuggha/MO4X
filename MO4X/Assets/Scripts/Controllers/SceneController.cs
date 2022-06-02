using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using System.Collections.Generic;

public class SceneController : MonoBehaviour
{
    public static SceneController instance;

    private bool chaningScene = false;

    private List<LoadingScreenAnimation> screens;

    private void Awake()
    {
        if (SceneController.instance != null)
        {
            Destroy(gameObject);
        }
        else
        {
            SceneController.instance = this;
            DontDestroyOnLoad(this);
        }
    }

    private void Start()
    {
        screens = new List<LoadingScreenAnimation>();
    }

    private void searchLoadingScreens()
    {
        foreach (var screen in FindObjectsOfType<LoadingScreenAnimation>())
        {
            screens.Add(screen);
        }
    }

    public void changeScene(string sceneName)
    {
        if (!chaningScene) {
            chaningScene = true;
            StartCoroutine(sceneChangeAfterLoadingScreen(sceneName));
        }
    }

    private IEnumerator sceneChangeAfterLoadingScreen(string sceneName)
    {

        searchLoadingScreens();

        for (int i = screens.Count - 1; i >= 0; i--)
        {
            if (screens[i] == null)
            {
                screens.RemoveAt(i);
            }
            else
            {
                screens[i].fadeIn();
            }
        }
        yield return new WaitForSeconds(.7f);
        chaningScene = false;
        SceneManager.LoadScene(sceneName);
    }
}
