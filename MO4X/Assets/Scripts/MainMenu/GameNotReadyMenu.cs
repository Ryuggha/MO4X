using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameNotReadyMenu : MonoBehaviour
{
    private TextEditor textEditor;
    private string inviteCode;
    private string id;

    [SerializeField] private Button leaveButton;
    [SerializeField] private GameObject layoutPosition;
    [SerializeField] private GameObject userNamePrefab;
    [SerializeField] private TextMeshProUGUI numberOfPlayersText;
    [SerializeField] private TextMeshProUGUI inviteCodeText;
    private MainMenuCanvasController canvasController;

    public void initialize(string id, int maxPlayers, string inviteCode, string[] users, MainMenuCanvasController canvasController)
    {
        this.id = id;
        this.canvasController = canvasController;
        textEditor = new TextEditor();
        numberOfPlayersText.text = users.Length + "/" + maxPlayers + " Players";
        this.inviteCode = inviteCode;
        inviteCodeText.text = inviteCode;

        foreach (string name in users)
        {
            TextMeshProUGUI text = Instantiate(userNamePrefab, layoutPosition.transform).GetComponent<TextMeshProUGUI>();
            text.text = name;
        }
    }

    public void OnCopyToClipboardClick()
    {
        if (this.textEditor == null) return;
        textEditor.text = inviteCode;
        textEditor.SelectAll();
        textEditor.Copy();
    }

    public void OnBackClick()
    {
        Destroy(gameObject);
    }

    public void OnLeaveGameClick()
    {
        leaveButton.interactable = false;
        StartCoroutine(canvasController.TryLeaveGame(id, leaveButton));
    }
}
