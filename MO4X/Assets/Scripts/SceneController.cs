using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using System.Collections.Generic;

public class SceneController : MonoBehaviour
{
    public static SceneController instance;

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
        foreach (var screen in FindObjectsOfType<LoadingScreenAnimation>())
        {
            screens.Add(screen);
        }
    }

    public void changeScene(string sceneName)
    {
        StartCoroutine(sceneChangeAfterLoadingScreen(sceneName));
    }

    private IEnumerator sceneChangeAfterLoadingScreen(string sceneName)
    {
        foreach (LoadingScreenAnimation screen in screens)
        {
            screen.fadeIn();
        }
        yield return new WaitForSeconds(.7f);
        SceneManager.LoadScene(sceneName);
    }
}
